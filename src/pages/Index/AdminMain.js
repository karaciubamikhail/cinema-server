import React from 'react';

/**
 * Компонент админки
 */
export default function AdminMain({ className, items, ...props }) {
  return <main className={className}>{props.children}</main>;
}
