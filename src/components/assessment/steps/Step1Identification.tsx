"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AssessmentValues } from "@/lib/validations/assessment";
import { INDUSTRIES, COMPANY_SIZES, YEARS_EXPERIENCE, STATES } from "@/lib/types";

export function Step1Identification() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AssessmentValues>();

  const e = errors.step1;

  const industryOptions = INDUSTRIES.map((i) => ({ value: i, label: i }));
  const companySizeOptions = COMPANY_SIZES.map((s) => ({ value: s, label: s }));
  const yearsOptions = YEARS_EXPERIENCE.map((y) => ({ value: y, label: y }));
  const stateOptions = STATES.map((s) => ({ value: s, label: s }));

  return (
    <div className="animate-enter space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Identificação Profissional
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Vamos começar com informações básicas sobre você e sua trajetória.
          Esses dados ajudam a personalizar o curso para o seu perfil.
        </p>
      </div>

      {/* Nome e apelido */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nome completo"
          placeholder="Seu nome completo"
          required
          error={e?.full_name?.message}
          {...register("step1.full_name")}
        />
        <Input
          label="Como prefere ser chamado(a)?"
          placeholder="Ex: Mari, Zé, Carol..."
          hint="Nome ou apelido para o ambiente de curso"
          error={e?.preferred_name?.message}
          {...register("step1.preferred_name")}
        />
      </div>

      {/* Contato */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          required
          error={e?.email?.message}
          {...register("step1.email")}
        />
        <Input
          label="WhatsApp / Telefone"
          type="tel"
          placeholder="(11) 99999-9999"
          error={e?.phone?.message}
          {...register("step1.phone")}
        />
      </div>

      {/* Empresa e cargo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Empresa"
          placeholder="Nome da empresa ou 'Autônomo'"
          error={e?.company?.message}
          {...register("step1.company")}
        />
        <Input
          label="Cargo / Função"
          placeholder="Ex: Diretora de Operações, CEO, Gerente..."
          required
          error={e?.job_title?.message}
          {...register("step1.job_title")}
        />
      </div>

      {/* Setor e tamanho */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Setor / Indústria"
          required
          placeholder="Selecione um setor"
          options={industryOptions}
          error={e?.industry?.message}
          {...register("step1.industry")}
        />
        <Select
          label="Tamanho da empresa (funcionários)"
          placeholder="Selecione o tamanho"
          options={companySizeOptions}
          error={e?.company_size?.message}
          {...register("step1.company_size")}
        />
      </div>

      {/* Localização */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Cidade"
          placeholder="Sua cidade"
          error={e?.city?.message}
          {...register("step1.city")}
        />
        <Select
          label="Estado"
          placeholder="UF"
          options={stateOptions}
          error={e?.state?.message}
          {...register("step1.state")}
        />
      </div>

      {/* Experiência e LinkedIn */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Anos de experiência profissional"
          placeholder="Selecione"
          options={yearsOptions}
          error={e?.years_experience?.message}
          {...register("step1.years_experience")}
        />
        <Input
          label="LinkedIn (opcional)"
          type="url"
          placeholder="https://linkedin.com/in/seuperfil"
          hint="Facilita conexões de networking"
          error={e?.linkedin_url?.message}
          {...register("step1.linkedin_url")}
        />
      </div>
    </div>
  );
}
