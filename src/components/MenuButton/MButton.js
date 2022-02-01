import { MenuButton, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
export default function MButton({ country, text }) {
  return country ? (
    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w='100%'>
      {text}
    </MenuButton>
  ) : (
    <MenuButton
      as={Button}
      rightIcon={<ChevronDownIcon />}
      w='100%'
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {text}
    </MenuButton>
  );
}
