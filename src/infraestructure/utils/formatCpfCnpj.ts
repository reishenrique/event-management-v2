export function formatCpf(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

export function formatCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '')
}
