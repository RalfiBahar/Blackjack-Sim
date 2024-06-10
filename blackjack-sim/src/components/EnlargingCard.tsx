import React from "react";
import { Card, CardProps } from "@chakra-ui/react";

interface EnlargingCardProps extends CardProps {
  cardId: string;
  enlargedCard: string | null;
  onCardClick: (cardId: string) => void;
}

const EnlargingCard: React.FC<EnlargingCardProps> = ({
  cardId,
  enlargedCard,
  onCardClick,
  children,
  ...props
}) => {
  const isEnlarged = enlargedCard === cardId;

  const handleClick = () => {
    onCardClick(cardId);
  };

  return (
    <Card {...props} onClick={handleClick} cursor="pointer">
      {children}
    </Card>
  );
};

export default EnlargingCard;
