-- =============================================================
-- Leadrix IA Assessment — Schema inicial
-- Execute no Supabase SQL Editor ou via: supabase db push
-- =============================================================

-- Habilitar extensões necessárias
create extension if not exists "uuid-ossp";

-- =============================================================
-- TABELA: profiles
-- Ligada a auth.users; armazena papel (role) do usuário
-- =============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Perfis de usuários administrativos do sistema';

-- Trigger para atualizar updated_at automaticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Trigger para criar profile automaticamente quando um novo usuário é criado no Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'viewer')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- TABELA: students
-- Cadastro dos alunos respondentes (sem conta no sistema)
-- =============================================================
create table if not exists public.students (
  id              uuid primary key default uuid_generate_v4(),
  full_name       text not null,
  preferred_name  text,
  email           text not null,
  phone           text,
  company         text,
  job_title       text,
  industry        text,
  company_size    text,
  city            text,
  state           text,
  linkedin_url    text,
  years_experience text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.students is 'Alunos participantes do Curso Leadrix IA';

create trigger students_updated_at
  before update on public.students
  for each row execute function public.handle_updated_at();

create index idx_students_email on public.students(email);
create index idx_students_industry on public.students(industry);
create index idx_students_created_at on public.students(created_at desc);

-- =============================================================
-- TABELA: assessment_responses
-- Respostas completas do formulário de assessment
-- =============================================================
create table if not exists public.assessment_responses (
  id                          uuid primary key default uuid_generate_v4(),
  student_id                  uuid not null unique references public.students(id) on delete cascade,

  -- Seção 2: Momento profissional
  strategic_moment            text,
  top_challenges              text[] default '{}',
  desired_results             text,

  -- Seção 3: Maturidade em IA
  ai_maturity_level           text check (ai_maturity_level in ('iniciante', 'basico', 'intermediario', 'avancado', 'especialista')),
  ai_maturity_score           smallint default 0, -- 1-5, calculado automaticamente
  current_ai_usage            text,
  tools_used                  text[] default '{}',
  current_ai_use_cases        text[] default '{}',
  main_barriers               text[] default '{}',

  -- Seção 4: Aplicação prática
  priority_area               text,
  highest_value_application   text,
  real_problem_to_use_in_course text,
  one_ready_application_expected text,
  application_scope           text,

  -- Seção 5: Networking
  networking_topics           text[] default '{}',
  contribution_offer          text,
  desired_connections         text,
  opt_in_matchmaking          boolean default true,

  -- Seção 6: Estilo de aprendizagem
  preferred_learning_style    text,
  participation_style         text,
  preferred_exercise_style    text,

  -- Seção 7: Resultado esperado
  ideal_course_outcome        text,
  success_definition          text,
  post_course_application     text,

  -- Metadados
  is_complete                 boolean default false,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

comment on table public.assessment_responses is 'Respostas do assessment de cada aluno';

create trigger assessment_responses_updated_at
  before update on public.assessment_responses
  for each row execute function public.handle_updated_at();

create index idx_assessment_student on public.assessment_responses(student_id);
create index idx_assessment_maturity on public.assessment_responses(ai_maturity_level);
create index idx_assessment_complete on public.assessment_responses(is_complete);

-- =============================================================
-- TABELA: networking_matches
-- Sugestões de conexão entre alunos
-- =============================================================
create table if not exists public.networking_matches (
  id              uuid primary key default uuid_generate_v4(),
  student_a_id    uuid not null references public.students(id) on delete cascade,
  student_b_id    uuid not null references public.students(id) on delete cascade,
  match_score     numeric(4,2) default 0, -- 0.00 a 10.00
  match_reason    text,
  match_tags      text[] default '{}',
  status          text not null default 'suggested' check (status in ('suggested', 'approved', 'contacted', 'dismissed')),
  created_by      uuid references public.profiles(id),
  created_at      timestamptz not null default now(),
  constraint no_self_match check (student_a_id <> student_b_id),
  constraint unique_pair unique (student_a_id, student_b_id)
);

comment on table public.networking_matches is 'Sugestões de networking geradas pelo sistema ou manualmente pelo admin';

create index idx_matches_student_a on public.networking_matches(student_a_id);
create index idx_matches_student_b on public.networking_matches(student_b_id);
create index idx_matches_status on public.networking_matches(status);

-- =============================================================
-- TABELA: admin_notes
-- Anotações internas da equipe sobre cada aluno
-- =============================================================
create table if not exists public.admin_notes (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid not null references public.students(id) on delete cascade,
  note        text not null,
  category    text default 'geral' check (category in ('geral', 'personalização', 'networking', 'atenção', 'destaque')),
  created_by  uuid references public.profiles(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.admin_notes is 'Anotações internas da equipe do Leadrix sobre os alunos';

create trigger admin_notes_updated_at
  before update on public.admin_notes
  for each row execute function public.handle_updated_at();

create index idx_admin_notes_student on public.admin_notes(student_id);

-- =============================================================
-- ROW LEVEL SECURITY — POLÍTICAS DE SEGURANÇA
-- =============================================================

-- Habilitar RLS em todas as tabelas
alter table public.profiles            enable row level security;
alter table public.students            enable row level security;
alter table public.assessment_responses enable row level security;
alter table public.networking_matches  enable row level security;
alter table public.admin_notes         enable row level security;

-- -------------------------------------------------------
-- profiles
-- -------------------------------------------------------
-- Usuário autenticado pode ver seu próprio perfil
create policy "profiles: ver próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins podem ver todos os perfis
create policy "profiles: admin vê todos"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- -------------------------------------------------------
-- students
-- -------------------------------------------------------
-- Qualquer um (inclusive anônimo) pode inserir — formulário público
create policy "students: inserção pública"
  on public.students for insert
  to anon, authenticated
  with check (true);

-- Somente autenticados podem ler, atualizar e deletar
create policy "students: autenticados leem"
  on public.students for select
  using (auth.role() = 'authenticated');

create policy "students: autenticados atualizam"
  on public.students for update
  using (auth.role() = 'authenticated');

create policy "students: admins deletam"
  on public.students for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- -------------------------------------------------------
-- assessment_responses
-- -------------------------------------------------------
create policy "assessment: inserção pública"
  on public.assessment_responses for insert
  to anon, authenticated
  with check (true);

create policy "assessment: autenticados leem"
  on public.assessment_responses for select
  using (auth.role() = 'authenticated');

create policy "assessment: autenticados atualizam"
  on public.assessment_responses for update
  using (auth.role() = 'authenticated');

create policy "assessment: admins deletam"
  on public.assessment_responses for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- -------------------------------------------------------
-- networking_matches
-- -------------------------------------------------------
create policy "matches: autenticados fazem tudo"
  on public.networking_matches for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- -------------------------------------------------------
-- admin_notes
-- -------------------------------------------------------
create policy "notes: autenticados fazem tudo"
  on public.admin_notes for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================================
-- FUNÇÃO AUXILIAR: criar admin manualmente
-- =============================================================
-- Execute esta função no SQL Editor para promover um usuário a admin:
-- SELECT make_admin('email@do.admin.com');
create or replace function public.make_admin(user_email text)
returns void as $$
begin
  update public.profiles
  set role = 'admin'
  where email = user_email;

  if not found then
    raise exception 'Usuário com email % não encontrado. Certifique-se de que ele já fez login.', user_email;
  end if;
end;
$$ language plpgsql security definer;

comment on function public.make_admin is
  'Promove um usuário existente a admin. Execute: SELECT make_admin(''email@admin.com'');';
