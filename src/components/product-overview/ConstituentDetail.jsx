import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const ConstituentDetail = ({ name, percentage }) => {
    const progressColor = '#3751FF';
    const progressWidth = `${13 + percentage * 1.7}%`;

    return (
        <Box position="relative" borderRadius="md" height="40px" width="100%" bg="#F7F7F7" overflow="hidden">
            <Box
                height="100%"
                width={progressWidth}
                bg={progressColor}
                borderRadius="8px"
            />
            <Box position="absolute" top="0" left="0" right="0" bottom="0" display="flex" justifyContent="space-between" alignItems="center" px={4}>
                <Text fontSize="sm" fontWeight="bold" color="white">{name}</Text>
                <Text fontSize="sm" color="#757575" fontWeight="bold">{percentage} %</Text>
            </Box>
        </Box>
    );
};

export default ConstituentDetail;