import React from 'react';
import styled from '@emotion/styled';
import cls from 'classnames';
import type { LoadingProps } from './types';

/**
 * Simple CSS Loader
 * - Replaces SVG loader with a CSS-based spinning ring
 * - Keeps same API: position classes (inline, inline-centered, floating)
 * - Theme-aware (dark/light)
 */

const Wrapper = styled.div`
  z-index: 99;
  display: inline-block;
  position: relative;
  pointer-events: none;

  &.inline {
    width: 30px;
    height: 30px;
    margin: 0;
  }

  &.inline-centered {
    width: 30px;
    height: 30px;
    margin: 0 auto;
    display: block;
  }

  &.floating {
    width: 50px;
    height: 50px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }
`;

const Loader = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #006239;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  /* Inherit size from wrapper */
  .inline & {
    width: 30px;
    height: 30px;
  }

  .inline-centered & {
    width: 30px;
    height: 30px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Dark/light theme support */
  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.3);
    border-top-color: #00cc66;
  }

  @media (prefers-color-scheme: light) {
    border-color: rgba(0, 0, 0, 0.1);
    border-top-color: #007b3e;
  }

  :root[data-theme='dark'] & {
    border-color: rgba(255, 255, 255, 0.3);
    border-top-color: #00cc66;
  }

  :root[data-theme='light'] & {
    border-color: rgba(0, 0, 0, 0.1);
    border-top-color: #007b3e;
  }
`;

const Label = styled.div`
  text-align: center;
  margin-top: 12px;
  font-size: 16px;
  color: white;

  @media (prefers-color-scheme: light) {
    color: #000;
  }
`;

export function Loading({
  position = 'floating',
  className,
}: LoadingProps) {
  return (
    <Wrapper
      className={cls('loading', position, className)}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      data-test="loading-indicator"
    >
      <Loader />
      <Label>Loading...</Label>
    </Wrapper>
  );
}

export type { LoadingProps };
