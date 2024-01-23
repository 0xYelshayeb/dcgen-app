import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { colors } from '../../lib/styles/colors';
import {blueLogo} from '@/lib/utils/assets';

const ProductInfo = () => {
    return (
        <Flex
            align="center"
            justify="space-between"
            p="16px"
            minW="220px" // Minimum width, adjust as needed
        >
            <Image src={blueLogo} alt="DC Logo" boxSize="50px" />
            <InfoBox title="Product" value="DCgen Governance Core" isLast={false} />
            <InfoBox title="Price" value="$32.56" isLast={false} />
            <InfoBox title="Mcap" value="$673,332,353" isLast={false} />
            <InfoBox title="Streaming Fee" value="0%" isLast={false} />
            <InfoBox title="Token Address" value="0xF17A...9caE8D" isLast={true} />
        </Flex>
    );
};

const InfoBox = ({ title, value, isLast }: { title: string, value: string, isLast: boolean }) => {
    return (
        <Box pr={isLast ? "0" : "16px"}>
            <Text fontSize="sm" color={colors.icGray3}>{title}</Text>
            <Text fontWeight="bold">{value}</Text>
        </Box>
    );
};

export default ProductInfo;
