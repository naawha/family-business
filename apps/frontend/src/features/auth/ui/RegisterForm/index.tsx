import { FC, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { Paper, Title, TextInput, PasswordInput, Button, Stack, Text, Anchor } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { saveAuth } from '@/shared/lib/auth-storage'
import { useRegisterMutation } from '@/models/accounts'

interface RegisterFormProps {}

const RegisterForm: FC<RegisterFormProps> = () => {
  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const result = await register({ name, email, password }).unwrap()
      saveAuth(result)
      notifications.show({
        title: 'Успех',
        message: 'Аккаунт создан успешно',
        color: 'green',
      })
      router.push('/setup')
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать аккаунт',
        color: 'red',
      })
    }
  }

  return (
    <Paper withBorder shadow="md" p={30} radius="md">
      <Title order={2} mb="lg">
        Регистрация
      </Title>

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Имя"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Зарегистрироваться
          </Button>

          <Text size="sm" ta="center">
            Уже есть аккаунт? <Anchor href="/login">Войти</Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  )
}

export default RegisterForm
