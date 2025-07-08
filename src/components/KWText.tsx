import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';
import { theme } from '@constants/colors';

// Define allowed variants
export type KWTextVariant =
  | 'title'
  | 'subtitle'
  | 'heading'
  | 'label'
  | 'body'
  | 'caption'
  | 'error'
  | 'link';

export interface KWTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  variant?: KWTextVariant;
  size?: number;
  weight?: TextStyle['fontWeight'];
  color?: string;
  align?: TextStyle['textAlign'];
}

const KWText: React.FC<KWTextProps> = ({
  children,
  style,
  variant = 'body',
  size,
  weight,
  color,
  align,
  numberOfLines,
  onPress,
  ...props
}) => {
  const getTextStyle = () => {
    const textStyle: (TextStyle | TextStyle[])[] = [styles.base];

    // Apply variant styles
    switch (variant) {
      case 'title':
        textStyle.push(styles.title);
        break;
      case 'subtitle':
        textStyle.push(styles.subtitle);
        break;
      case 'heading':
        textStyle.push(styles.heading);
        break;
      case 'label':
        textStyle.push(styles.label);
        break;
      case 'caption':
        textStyle.push(styles.caption);
        break;
      case 'error':
        textStyle.push(styles.error);
        break;
      case 'link':
        textStyle.push(styles.link);
        break;
      case 'body':
      default:
        textStyle.push(styles.body);
        break;
    }

    // Apply custom size
    if (size) {
      textStyle.push({ fontSize: size });
    }

    // Apply custom weight
    if (weight) {
      textStyle.push({ fontWeight: weight });
    }

    // Apply custom color
    if (color) {
      textStyle.push({ color });
    }

    // Apply custom alignment
    if (align) {
      textStyle.push({ textAlign: align });
    }

    // Apply custom styles
    if (style) {
      textStyle.push(style);
    }

    return textStyle;
  };

  return (
    <Text
      style={getTextStyle()}
      numberOfLines={numberOfLines}
      onPress={onPress}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: theme.black,
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 17,
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    color: theme.gray,
  },
  error: {
    fontSize: 14,
    color: '#ff4444',
    marginBottom: 15,
    marginLeft: 5,
  },
  link: {
    fontSize: 17,
    color: theme.orange,
    fontWeight: '400',
  },
});

export default KWText; 