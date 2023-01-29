import { useIsoMorphicEffect } from '../use-iso-morphic-effect'
import { useStore } from '../../hooks/use-store'
import { overflows, ScrollLockStep } from './overflow-store'

export function useDocumentOverflowLockedEffect(
  doc: Document | null,
  shouldBeLocked: boolean,
  steps: () => ScrollLockStep[],
  meta: (meta?: Record<string, any>) => Record<string, any>
) {
  let store = useStore(overflows)
  let entry = doc ? store.get(doc) : undefined
  let locked = entry ? entry.count > 0 : false

  useIsoMorphicEffect(() => {
    if (!doc || !shouldBeLocked) {
      return
    }

    // Prevent the document from scrolling
    overflows.dispatch('PUSH', doc, steps(), meta)

    // Allow document to scroll
    return () => overflows.dispatch('POP', doc)
  }, [shouldBeLocked, doc])

  return locked
}
