// src/apps/points/components/Points/MobileDeviceAlert.jsx
import { useEffect, useState } from "react";

const MobileDeviceAlert = () => {
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    useEffect(() => {
        const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobileDevice(mobileCheck);
    }, []);

    if (!isMobileDevice) return null;

    return (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
                <span className="text-yellow-600">📱</span>
                <div>
                    <p className="text-sm font-medium text-yellow-800">
                        Modo móvil detectado
                    </p>
                    <p className="text-xs text-yellow-700">
                        Para mejor compatibilidad, prueba en "modo escritorio"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MobileDeviceAlert;