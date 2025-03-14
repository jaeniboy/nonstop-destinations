import { Sheet } from 'react-modal-sheet';
import { useState, useRef } from 'react';

export default function Example({children}) {
    const [isOpen, setOpen] = useState(true);

    const snapPoints = [0.8, 0.3];
    const initialSnap = 1; // Initial snap point when sheet is opened
    

    return (
        <>
            <button onClick={() => setOpen(true)}>Open sheet</button>

            <Sheet 
                isOpen={isOpen} 
                onClose={() => setOpen(true)} 
                snapPoints={snapPoints}
                initialSnap={initialSnap}>
                <Sheet.Container>
                    <Sheet.Header>
                    </Sheet.Header>
                    <Sheet.Content>
                        {children}
                    </Sheet.Content>
                </Sheet.Container>
                {/* <Sheet.Backdrop /> */}
            </Sheet>
        </>
    );
}