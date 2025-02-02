import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { colors } from '../../lib/styles/colors';
import { blueLogo } from '@/lib/utils/assets';
import { useState, useEffect } from 'react';

interface TokenData {
    name: string;
    image: string;
    price: number;
    market_cap: number;
    streaming_fee: number;
    token_address: string;
}

interface ProductInfoProps {
    product: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [data, setData] = useState<TokenData | null>(null);
    // pass product into the link and keep in mind there are spaces
    useEffect(() => {
        // Fetch data from API
        fetch("https://api.dcgen.finance/overview/?product=" + product)
            .then(res => res.json())
            .then(data => {
                setData(data);
            });
    }, [product]);

    return (
        <Flex
            align="center"
            justify="space-between"
            p="16px"
            minW="220px" // Minimum width, adjust as needed
        >
            <Image src={blueLogo} alt="DC Logo" boxSize="50px" />
            <InfoBox title="Product" value={data?.name || 'N/A'} isLast={false} />
            <InfoBox title="Price" value={`$${data?.price.toFixed(2) || 'N/A'}`} isLast={false} />
            <InfoBox title="Mcap" value={`$${data?.market_cap.toFixed(0) || 'N/A'}`} isLast={false} />
            <InfoBox title="Streaming Fee" value={`${data?.streaming_fee.toString() || 'N/A'}%`} isLast={false} />
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
