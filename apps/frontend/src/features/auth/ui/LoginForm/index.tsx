import { FC, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { Paper, Title, TextInput, PasswordInput, Button, Stack, Text, Anchor } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { saveAuth } from '@/shared/lib/auth-storage'
import { useLoginMutation } from '@/models/accounts'

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = () => {
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const result = await login({ email, password }).unwrap()
      saveAuth(result)
      notifications.show({
        title: 'Успех',
        message: 'Вход выполнен успешно',
        color: 'green',
      })
      router.push('/dashboard')
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Неверные учётные данные',
        color: 'red',
      })
    }
  }

  return (
    <Paper withBorder shadow="md" p={30} radius="md">
      <Title order={2} mb="lg">
        Вход
      </Title>

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PasswordInput
            label="Пароль"
            placeholder="Ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" fullWidth loading={isLoading}>
            Войти
          </Button>

          <Text size="sm" ta="center">
            Нет аккаунта? <Anchor href="/register">Зарегистрироваться</Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  )
}

export default LoginForm
