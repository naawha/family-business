import { FC } from 'react'
import { Container } from '@mantine/core'
import { RegisterForm } from '@/features/auth'

interface RegisterViewProps {}

const RegisterView: FC<RegisterViewProps> = () => {
  return (
    <Container size="xs" style={{ paddingTop: '100px' }}>
      <RegisterForm />
    </Container>
  )
}

export default RegisterView
