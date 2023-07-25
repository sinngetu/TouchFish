import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { MenuData } from 'src/react-app-env'
import i18n from 'src/i18n'
import { Lang } from 'src/lang'

export function useMenu(data: MenuData[] | undefined = undefined) {
  const history = useLocation()

  useEffect(() => { window.setMenu && window.setMenu(data, i18n[window.localStorage.getItem('language')! as Lang]?.Common.project) }, [history])
}
