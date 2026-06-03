import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTerminal } from './useTerminal';

describe('useTerminal Hook', () => {
  describe('Testing prompt state', () => {
    it('correctly saves prompts to the history state', () => {
      const { result } = renderHook(() => useTerminal());
      act(() => result.current.handlePrompt('greet'));

      expect(result.current.promptHistory).toContain('greet');
    });

    it('saves command and output to the prompts state', () => {
      const { result } = renderHook(() => useTerminal());
      const expectedPromptState = [{
        command: 'greet',
        output: 'Hello from OhMyRsh!'
      }];

      act(() => result.current.handlePrompt('greet'));

      expect(result.current.prompts).toStrictEqual(expectedPromptState)
    });
  });
  
  describe('Testing specific commands', () => {
    it('returns error message to output if command not found', () => {
      const { result } = renderHook(() => useTerminal());
      const expectedPromptState = [{
        command: 'wrong',
        output: 'rsh: command not found: wrong'
      }];

      act(() => result.current.handlePrompt('wrong'));

      expect(result.current.prompts).toStrictEqual(expectedPromptState);
    });

    it('should clear prompts when running clear command', () => {
      const { result } = renderHook(() => useTerminal());
      
      expect(result.current.prompts.length).toBe(0);
      act(() => result.current.handlePrompt('greet'));
      expect(result.current.prompts.length).toBe(1);

      act(() => result.current.handlePrompt('clear'));
      expect(result.current.prompts.length).toBe(0);
    });

    it('should print correct output to prompt state when using echo command', () => {
      const { result } = renderHook(() => useTerminal());
      const expectedPromptState = [{
        command: 'echo Hello world!',
        output: 'Hello world!'
      }];

      act(() => result.current.handlePrompt('echo Hello world!'));
      expect(result.current.prompts).toStrictEqual(expectedPromptState);
    })
  });
});
