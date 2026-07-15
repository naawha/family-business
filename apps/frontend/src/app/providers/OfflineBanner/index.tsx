import { FC, useEffect, useState } from 'react'
import { Affix, Alert, Transition } from '@mantine/core'
import { IconWifiOff } from '@tabler/icons-react'

/**
 * Баннер «Оффлайн» — только просмотр сохранённых данных.
 */
const OfflineBanner: FC = () => {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const sync = () => setOffline(typeof navigator !== 'undefined' && !navigator.onLine)
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  return (
    <Affix position={{ top: 8, left: 8, right: 8 }} zIndex={400}>
      <Transition mounted={offline} transition="slide-down" duration={200}>
        {(styles) => (
          <Alert
            style={styles}
            icon={<IconWifiOff size={16} />}
            color="yellow"
            variant="filled"
            title="Нет сети"
            radius="md"
          >
            Доступен просмотр ранее загруженных задач, покупок, рецептов и заметок. Изменения
            появятся после подключения к интернету.
          </Alert>
        )}
      </Transition>
    </Affix>
  )
}

export default OfflineBanner
