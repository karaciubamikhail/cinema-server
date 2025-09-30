import React from 'react';
/**
 * Компонент списка меню
 */
export default function MenuList({ className, items, ...props }) {
  return <ul className={className}>{props.children(items)}</ul>;
}
