import type { User } from '@/types'

export const SAMPLE_USER = {
  email: 'alazargrammar@gmail.com',
  password: 'Alazar123'
}

export const authService = {
  async login(emailOrPhone: string, _password?: string, role: 'farmer' | 'buyer' = 'farmer'): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 150))
    return {
      id: role === 'farmer' ? 'user-farmer-1' : 'user-buyer-1',
      name: role === 'farmer' ? 'John Doe (Farmer)' : 'Alazar Grammar (Buyer)',
      email: emailOrPhone || SAMPLE_USER.email,
      phone: '+254 712 345 678',
      role: role
    }
  },

  async register(data: { name: string; emailOrPhone: string; role: User['role'] }): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 150))
    return {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      name: data.name,
      email: data.emailOrPhone.includes('@') ? data.emailOrPhone : `${data.name.toLowerCase().replace(/\s+/g, '')}@farm.com`,
      phone: data.emailOrPhone.includes('@') ? '+254 700 000 000' : data.emailOrPhone,
      role: data.role
    }
  }
}
