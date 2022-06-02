import { useWindowEvent } from './use-window-event'
import { Ref } from 'vue'
import { dom } from '../utils/dom'
import { microTask } from '../utils/micro-task'

type Container = Ref<HTMLElement | null> | HTMLElement | null
type ContainerCollection = Container[] | Set<Container>
type ContainerInput = Container | ContainerCollection

export function useOutsideClick(
  containers: ContainerInput | (() => ContainerInput),
  cb: (event: MouseEvent | PointerEvent, target: HTMLElement) => void
) {
  useWindowEvent('click', (event) => {
    let target = event.target as HTMLElement

    // Ignore if the target doesn't exist in the DOM anymore
    if (!target.ownerDocument.documentElement.contains(target)) return

    let _containers = (function resolve(containers): ContainerCollection {
      if (typeof containers === 'function') {
        return resolve(containers())
      }

      if (Array.isArray(containers)) {
        return containers
      }

      if (containers instanceof Set) {
        return containers
      }

      return [containers]
    })(containers)

    // Ignore if the target exists in one of the containers
    for (let container of _containers) {
      if (container === null) continue
      let domNode = container instanceof HTMLElement ? container : dom(container)
      if (domNode?.contains(target)) {
        return
      }
    }

    cb(event, target)
  })
}
