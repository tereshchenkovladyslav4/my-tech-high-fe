import React from 'react'
import { Modal, Box, Button, Typography } from '@mui/material'

const EnrollmentWarnSaveModal: React.FC<{
    onClose: () => void,
    onSave: () => void,
}> = ({ onClose, onSave }) => {
    return (
        <Modal
            open={true}
            onClose={onClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '30%',
                left: '40%',
                width: 400,
                padding: '1rem',
                borderRadius: 3,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <h2 id="child-modal-title">Missing Vaccine</h2>
                <div id="child-modal-description">
                    <Typography sx={{ width: '300px', textAlign: 'center', padding: '10px 0 20px 0' }}>
                        Data is missing for immunizatoins.
                        Do you wish to save the packet?
                    </Typography>
                </div>
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-evenly',
                }}>
                    <Button
                        sx={{
                            borderRadius: 20,
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold',
                            paddingX: '50px',
                            textTransform: 'none',
                        }}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            borderRadius: 20,
                            backgroundColor: 'black',
                            color: 'white',
                            fontWeight: 'bold',
                            paddingX: '50px',
                            hover: {
                                backgroundColor: '#a0a0a0',
                            }
                        }}
                        onClick={onSave}
                    >
                        Yes
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default EnrollmentWarnSaveModal