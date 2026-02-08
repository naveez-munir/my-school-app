import { useState, useCallback } from 'react';
import type { PopulatedStudentFee } from '~/types/studentFee';
import type { ClassSelection } from '~/components/Fee/studentFee/GenerateRecurringFeesModal';

export type ModalState =
  | { modal: null }
  | { modal: 'generate' }
  | { modal: 'bulkGenerate' }
  | { modal: 'adhoc' }
  | { modal: 'discount'; fee: PopulatedStudentFee }
  | { modal: 'cancel'; feeId: string }
  | { modal: 'viewDetails'; fee: PopulatedStudentFee }
  | { modal: 'payment'; fee: PopulatedStudentFee }
  | { modal: 'bulkPayment' }
  | { modal: 'recurring'; classesRequiringSelection: ClassSelection[] }
  | { modal: 'confirmLateFees' }
  | { modal: 'confirmUpdateStatuses' }
  | { modal: 'settlement'; student: { id: string; name: string } }
  | { modal: 'transfer'; student: { id: string; name: string; classId?: string } };

export function useStudentFeeModals() {
  const [state, setState] = useState<ModalState>({ modal: null });

  const close = useCallback(() => setState({ modal: null }), []);

  const openGenerate = useCallback(() => setState({ modal: 'generate' }), []);
  const openBulkGenerate = useCallback(() => setState({ modal: 'bulkGenerate' }), []);
  const openAdhoc = useCallback(() => setState({ modal: 'adhoc' }), []);
  const openDiscount = useCallback((fee: PopulatedStudentFee) => setState({ modal: 'discount', fee }), []);
  const openCancel = useCallback((feeId: string) => setState({ modal: 'cancel', feeId }), []);
  const openViewDetails = useCallback((fee: PopulatedStudentFee) => setState({ modal: 'viewDetails', fee }), []);
  const openPayment = useCallback((fee: PopulatedStudentFee) => setState({ modal: 'payment', fee }), []);
  const openBulkPayment = useCallback(() => setState({ modal: 'bulkPayment' }), []);
  const openRecurring = useCallback(() => setState({ modal: 'recurring', classesRequiringSelection: [] }), []);
  const openConfirmLateFees = useCallback(() => setState({ modal: 'confirmLateFees' }), []);
  const openConfirmUpdateStatuses = useCallback(() => setState({ modal: 'confirmUpdateStatuses' }), []);
  const openSettlement = useCallback((id: string, name: string) =>
    setState({ modal: 'settlement', student: { id, name } }), []);
  const openTransfer = useCallback((id: string, name: string, classId?: string) =>
    setState({ modal: 'transfer', student: { id, name, classId } }), []);

  const updateClassesRequiringSelection = useCallback((classes: ClassSelection[]) => {
    setState(prev => prev.modal === 'recurring'
      ? { ...prev, classesRequiringSelection: classes }
      : prev
    );
  }, []);

  return {
    state,
    close,
    openGenerate,
    openBulkGenerate,
    openAdhoc,
    openDiscount,
    openCancel,
    openViewDetails,
    openPayment,
    openBulkPayment,
    openRecurring,
    openConfirmLateFees,
    openConfirmUpdateStatuses,
    openSettlement,
    openTransfer,
    updateClassesRequiringSelection,
  };
}
