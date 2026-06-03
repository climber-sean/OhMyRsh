import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTerminal } from './useTerminal';

describe('Example', () => {
  it('correctly saves prompts to the history state', () => {
    const { result } = renderHook(() => useTerminal());
    act(() => result.current.handlePrompt('greet'));
    

    console.log(result.current.promptHistory);
    expect(result.current.promptHistory).toContain('greet');
  });

  it('saves command and output to the prompts state', () => {
    const { result } = renderHook(() => useTerminal());
    const expectedPromptState = [{
      command: 'greet',
      output: 'Hello from OhMyRsh!'
    }]
    act(() => result.current.handlePrompt('greet'));

    expect(result.current.prompts).toEqual(expectedPromptState)
  });

  it('returns error message to output if command not found', () => {
    const { result } = renderHook(() => useTerminal());
    const expectedPromptState = [{
      command: 'wrong',
      output: 'rsh: command not found: wrong'
    }]

    act(() => result.current.handlePrompt('wrong'));

    expect(result.current.prompts).toEqual(expectedPromptState);
  });
 })
