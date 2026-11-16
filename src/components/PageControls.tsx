import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import IconButton from './IconButton';
import theme from '../constants/theme';

type Props = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  label?: string;
};

/** 48dp previous/next targets with a visibly disabled endpoint. */
function PageControls({ page, pageCount, onChange, label }: Props) {
  const atStart = page <= 0;
  const atEnd = page >= pageCount - 1;
  return (
    <View style={styles.row}>
      <IconButton
        Icon={ChevronLeft}
        accessibilityLabel="Previous page"
        onPress={() => onChange(page - 1)}
        disabled={atStart}
      />
      <Text style={styles.label} numberOfLines={1}>
        {label || 'Page ' + String(page + 1) + ' of ' + String(pageCount)}
      </Text>
      <IconButton
        Icon={ChevronRight}
        accessibilityLabel="Next page"
        onPress={() => onChange(page + 1)}
        disabled={atEnd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 48,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },
});

export default React.memo(PageControls);
