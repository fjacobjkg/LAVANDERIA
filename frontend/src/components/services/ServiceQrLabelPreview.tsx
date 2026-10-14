import {
  QRCodeSVG,
} from "qrcode.react";


interface ServiceQrLabelPreviewProps {
  code: string;

  qrToken: string;

  garments: number;
}


export function ServiceQrLabelPreview({
  code,
  qrToken,
  garments,
}: ServiceQrLabelPreviewProps) {
  return (
    <div className="qr-label-preview">

      <div className="qr-label-preview-header">
        QR del servicio
      </div>


      <div className="qr-label-code-image">
        <QRCodeSVG
          value={qrToken}
          size={220}
          level="M"
          marginSize={4}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>


      <strong className="qr-label-code">
        {code}
      </strong>


      <span className="qr-label-garments">
        {garments} prendas
      </span>

    </div>
  );
}