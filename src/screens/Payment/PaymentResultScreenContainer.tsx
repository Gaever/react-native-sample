import React from 'react';
import {observer} from 'mobx-react-lite';
import PaymentSuccessScreenContent from './PaymentSuccessScreenContent';
import PaymentFailedScreenContent, {
  PaymentFailedScreenContentProps,
} from './PaymentFailedScreenContent';
import {useAppState} from '~store/app-state';

export interface PaymentResultScreenContainerProps
  extends Partial<PaymentFailedScreenContentProps> {
  success: boolean;
  onSuccessPress: () => void;
  onReturnToMainScreenPress: () => void;
  onReturnToPaymentOptionsPress: () => void;
}

const PaymentResultScreenContainer = observer(
  (props: PaymentResultScreenContainerProps) => {
    const {isAuthorizedView, setIsAuthorizedView} = useAppState();
    const {
      success,
      onSuccessPress,
      onReturnToMainScreenPress,
      onReturnToPaymentOptionsPress,
      ...PaymentFailedScreenContentProps
    } = props;

    if (props.success) {
      return (
        <PaymentSuccessScreenContent
          onPress={() => {
            if (!isAuthorizedView) {
              setIsAuthorizedView(true);
            } else {
              onSuccessPress();
            }
          }}
        />
      );
    }

    return (
      <PaymentFailedScreenContent
        onReturnToMainScreenPress={async () => {
          if (isAuthorizedView) {
            setIsAuthorizedView(true);
          } else {
            onReturnToMainScreenPress();
          }
        }}
        onReturnToPaymentOptionsPress={onReturnToPaymentOptionsPress}
        {...PaymentFailedScreenContentProps}
      />
    );
  },
);

export default PaymentResultScreenContainer;
