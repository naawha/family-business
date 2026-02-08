import { FC } from 'react'
import { Container } from '@mantine/core'
import { LoginForm } from '@/features/auth'

interface LoginViewProps {}

const LoginView: FC<LoginViewProps> = () => {
  return (
    <Container size="xs" style={{ paddingTop: '100px' }}>
      <LoginForm />
    </Container>
  )
}

export default LoginView
