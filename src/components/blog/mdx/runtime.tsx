"use client";

import React, { createContext, useContext, useMemo } from "react";
import * as jsxDevRuntime from "react/jsx-dev-runtime";
import * as jsxRuntime from "react/jsx-runtime";

/**
 * Minimal client-side runtime for compiled MDX (the `compiledSource` format
 * produced by next-mdx-remote/serialize).
 *
 * The compiled function body starts with
 *   const {Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs} = arguments[0];
 *   const {useMDXComponents: _provideComponents} = arguments[0];
 * so the first argument must carry the JSX runtime plus a components hook.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MDXComponents = Record<string, React.ComponentType<any> | keyof React.JSX.IntrinsicElements>;

const ComponentsContext = createContext<MDXComponents>({});

function useMDXComponents(extra?: MDXComponents | ((c: MDXComponents) => MDXComponents)) {
  const ctx = useContext(ComponentsContext);
  if (typeof extra === "function") return extra(ctx);
  return extra ? { ...ctx, ...extra } : ctx;
}

export interface SerializedMDX {
  compiledSource: string;
  frontmatter?: Record<string, unknown>;
  scope?: Record<string, unknown>;
}

export interface MDXRemoteProps extends SerializedMDX {
  components?: MDXComponents;
}

type MDXContentComponent = React.ComponentType<{ components?: MDXComponents }>;

const EMPTY = {};

function MdxError() {
  return <div className="mdx-empty" />;
}

export function MDXRemote({ compiledSource, frontmatter = EMPTY, scope = EMPTY, components }: MDXRemoteProps) {
  const Content = useMemo<MDXContentComponent>(() => {
    const args: Record<string, unknown> = {
      runMdxOptions: {
        useMDXComponents,
        baseUrl: undefined,
        jsx: jsxRuntime.jsx,
        jsxs: jsxRuntime.jsxs,
        jsxDEV: jsxDevRuntime.jsxDEV,
        Fragment: jsxRuntime.Fragment,
        React,
      },
      frontmatter,
      ...scope,
    };
    const keys = Object.keys(args);
    const values = Object.values(args);
    try {
      const fn = Reflect.construct(Function, keys.concat(compiledSource)) as (...a: unknown[]) => {
        default: MDXContentComponent;
      };
      return fn(...values).default;
    } catch (error) {
      console.error("Failed to evaluate MDX content", error);
      return MdxError;
    }
  }, [compiledSource, frontmatter, scope]);

  return (
    <ComponentsContext.Provider value={components ?? EMPTY}>
      <Content />
    </ComponentsContext.Provider>
  );
}
