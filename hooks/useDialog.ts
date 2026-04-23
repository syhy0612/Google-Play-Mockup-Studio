import { useState } from 'react';
import { DialogState, DialogType } from '../components/editor/CustomDialog';

interface OpenDialogArgs {
  type: DialogType;
  title: string;
  message?: string;
  defaultValue?: string;
  onConfirm: (value?: string) => void;
}

export const useDialog = () => {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: 'confirm',
    title: '',
    onConfirm: () => {},
  });

  const open = (args: OpenDialogArgs) => setDialog({ ...args, isOpen: true });
  const close = () => setDialog((prev) => ({ ...prev, isOpen: false }));

  return { dialog, open, close };
};
