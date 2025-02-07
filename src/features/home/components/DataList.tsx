import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export interface DataItem {
  id: number;
  name: string;
}

interface DataListProps {
  data: DataItem[];
}

const DataList: React.FC<DataListProps> = ({ data }) => {
  return (
    <Box>
      {data.map((item) => (
        <Link
          to={`/items/${item.id}`}
          key={item.id}
          style={{ textDecoration: 'none' }} 
        >
          <Box
            p={2}
            mb={2}
            border={1}
            borderColor="grey.300"
            borderRadius={2}
            sx={{
              '&:hover': { backgroundColor: 'grey.100' },
            }}
          >
            <Typography variant="body1" color="textPrimary">
              {item.name}
            </Typography>
          </Box>
        </Link>
      ))}
    </Box>
  );
};

export default DataList;
