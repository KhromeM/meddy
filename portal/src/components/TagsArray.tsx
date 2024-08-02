import React from 'react';
import { Badge, Box, useMantineTheme } from '@mantine/core';

interface TagsArrayProps {
  values: string[];
}

export const TagsArray: React.FC<TagsArrayProps> = ({ values }) => {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'flex-start',
        flexDirection: 'row',
      }}
    >
      {values.map((value, index) => (
        <Badge
          key={index}
          variant="outline"
          color="primary"
          radius="xl"
          style={{ backgroundColor: theme.colors.secondary[7], borderColor: theme.colors.secondary[1] }}
        >
          {value}
        </Badge>
      ))}
    </Box>
  );
};
