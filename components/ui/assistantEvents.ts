export type AssistantAction = 'generate-summary' | 'improve-bullet' | 'tailor-resume' | 'check-ats'

export type AssistantSuggestion =
  | { type: 'summary'; text: string }
  | { type: 'bullet'; text: string; experienceId: string; bulletIndex: number }

export interface AssistantResult {
  message: string
  suggestion?: AssistantSuggestion
}

export type AssistantEventDetail =
  | {
      type: 'action'
      action: AssistantAction
      respond: (result: AssistantResult) => void
    }
  | {
      type: 'apply'
      suggestion: AssistantSuggestion
      respond: (result: AssistantResult) => void
    }

const ASSISTANT_EVENT = 'resume-ai-assistant'

export function dispatchAssistantEvent(detail: AssistantEventDetail) {
  return window.dispatchEvent(
    new CustomEvent<AssistantEventDetail>(ASSISTANT_EVENT, { detail, cancelable: true }),
  )
}

export function addAssistantEventListener(listener: (event: CustomEvent<AssistantEventDetail>) => void) {
  const handler = (event: Event) => listener(event as CustomEvent<AssistantEventDetail>)
  window.addEventListener(ASSISTANT_EVENT, handler)
  return () => window.removeEventListener(ASSISTANT_EVENT, handler)
}
