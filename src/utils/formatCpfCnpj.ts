export function formatCpfCnpj(cpfCnpj: string): string {
  return cpfCnpj.replace(/[.-]/g, '')
}
