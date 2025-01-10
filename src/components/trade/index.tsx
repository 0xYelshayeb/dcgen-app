import { useState } from 'react'

import { colors, useICColorMode } from '../../lib/styles/colors'

import { Flex, Text } from '@chakra-ui/react'

import { Settings } from '@/components/settings'
import { useSlippage } from '@/lib/providers/slippage'

import { Issue } from './issue'
import { Redeem } from './redeem'
import { Swap, QuickTradeProps } from './swap'

enum TradeType {
  redeem,
  issue,
  swap,
}

const QuickTradeContainer = (props: QuickTradeProps) => {
  const [selectedType, setSelectedType] = useState<TradeType>(TradeType.swap)

  const onSelectType = (type: TradeType) => {
    if (type !== selectedType) {
      setSelectedType(type);
    }
  };

  return (
    <Flex
      background='#FCFCFC'
      direction='column'
      p='8px 16px 16px'
      height={'100%'}
    >
      <Navigation
        onSelect={onSelectType}
        selectedType={selectedType}
      />
      <Swap {...props} />
    </Flex>
  )
}

type NavigationButtonProps = {
  isSelected: boolean
  onClick: () => void
  title: string
}

const NavigationButton = (props: NavigationButtonProps) => {
  return (
    <Text
      color={props.isSelected ? colors.icGray4 : colors.icGray2}
      cursor='pointer'
      fontSize='14px'
      fontWeight='700'
      onClick={props.onClick}
    >
      {props.title}
    </Text>
  )
}

type NavigationProps = {
  onSelect: (type: TradeType) => void
  selectedType: TradeType
}

const Navigation = (props: NavigationProps) => {

  const { isDarkMode } = useICColorMode()

  const { onSelect, selectedType } = props

  const swapIsSelected = selectedType === TradeType.swap;
  return (
    <Flex align='center' justify='space-between' pl={'16px'}>
      <Flex gap={'24px'}>
        <NavigationButton
          isSelected={swapIsSelected}
          onClick={() => onSelect(TradeType.swap)}
          title='Invest'
        />
      </Flex>
    </Flex>
  )
}

export default QuickTradeContainer
