import SVGIcon from '@/components/Icons/SVGIcon';

import { style } from './AccordionButton.style';

interface AccordionButtonProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openTitle: string;
  closeTitle: string;
}

const AccordionButton = ({ isOpen, setIsOpen, openTitle, closeTitle }: AccordionButtonProps) => {
  return (
    <button
      type="button"
      className={style()}
      onClick={() => setIsOpen(prev => !prev)}
      aria-expanded={isOpen}
    >
      <span>{isOpen ? openTitle : closeTitle}</span>
      <SVGIcon icon={isOpen ? 'IC_ArrowdropUp' : 'IC_ArrowdropDown'} size="md" aria-hidden="true" />
    </button>
  );
};

AccordionButton.displayName = 'AccordionButton';
export default AccordionButton;
