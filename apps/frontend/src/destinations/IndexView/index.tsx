import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container, Title, Text, Button, Stack } from '@mantine/core'
import { useToken } from '@/shared/lib/useAuth'

interface IndexViewProps {}

const IndexView: FC<IndexViewProps> = () => {
  const router = useRouter()
  const token = useToken()

  useEffect(() => {
    if (token) {
      router.push('/dashboard')
    }
  }, [token, router])

  return (
    <Container size="md" style={{ paddingTop: '100px' }}>
      <Stack align="center" gap="xl">
        <Title order={1}>Family Business</Title>
        <Text size="lg" c="dimmed" ta="center">
          Управляйте семейными задачами, списками покупок и запланированными покупками в одном месте
        </Text>
        <Stack gap="md">
          <Button size="lg" onClick={() => router.push('/login')}>
            Вход
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/register')}>
            Регистрация
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}

export default IndexView
