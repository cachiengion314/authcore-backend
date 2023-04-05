export interface JwtDto {
  tenantId: string
  userId: string
  /**
   * Issued at
   */
  iat: number
  /**
   * Expiration time
   */
  exp: number
}
