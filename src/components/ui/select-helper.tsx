
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Helper component to wrap Select.Item components and ensure they always have a valid value prop
 */
export const ValidatedSelectItem = ({ 
  value, 
  children,
  ...props
}: React.ComponentProps<typeof SelectItem>) => {
  if (!value || value === '') {
    console.warn('SelectItem must have a non-empty value prop');
    // Provide a fallback value if none is given
    return (
      <SelectItem value={`item-${Math.random().toString(36).substring(2)}`} {...props}>
        {children}
      </SelectItem>
    );
  }
  
  return <SelectItem value={value} {...props}>{children}</SelectItem>;
};

/**
 * Example of proper Select usage with validated items
 */
export const SelectExample = () => {
  const [value, setValue] = React.useState("");
  
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <ValidatedSelectItem value="option1">Option 1</ValidatedSelectItem>
        <ValidatedSelectItem value="option2">Option 2</ValidatedSelectItem>
        <ValidatedSelectItem value="option3">Option 3</ValidatedSelectItem>
      </SelectContent>
    </Select>
  );
};
