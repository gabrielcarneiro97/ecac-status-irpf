import React, { useEffect, useState } from 'react';

import {
  ProgressBar, Overlay, H3, Classes, Intent,
} from '@blueprintjs/core';

import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';

function ConsultaStatus() {
  const QUERY = gql`
    subscription {
      workerStatus {
        isBusy, progress
      }
    }
  `;

  const { data, loading } = useSubscription(QUERY);

  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (data) {
      const { workerStatus } = data;
      setShow(!loading && workerStatus.isBusy);
      setProgress(workerStatus.progress);
    }
  }, [data, loading]);

  return (
    <Overlay
      isOpen={show}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
      usePortal={false}
      hasBackdrop
    >
      <div
        className={[Classes.CARD, Classes.ELEVATION_3].join(' ')}
        style={{ top: 100, left: 41 }}
      >
        <H3>Processamento em andamento!</H3>
        <p>
          Aguarde enquanto a última solicitação é executada,
          você pode acompanhar o progresso na barra a baixo.
        </p>
        <div>
          <ProgressBar intent={Intent.PRIMARY} value={progress} />
        </div>
      </div>
    </Overlay>
  );
}

export default ConsultaStatus;
