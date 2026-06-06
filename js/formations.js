const FORMATIONS = {
    '4-3-3': [
        { id: 'pos1', label: 'LW', valid: ['LW', 'LM', 'ST', 'CF', 'CAM'], x: 20, y: 15 },
        { id: 'pos2', label: 'ST', valid: ['ST', 'CF'], x: 50, y: 10 },
        { id: 'pos3', label: 'RW', valid: ['RW', 'RM', 'ST', 'CF', 'CAM'], x: 80, y: 15 },
        { id: 'pos4', label: 'LCM', valid: ['CM', 'CAM', 'CDM', 'LM'], x: 30, y: 40 },
        { id: 'pos5', label: 'CDM', valid: ['CDM', 'CM', 'CB'], x: 50, y: 50 },
        { id: 'pos6', label: 'RCM', valid: ['CM', 'CAM', 'CDM', 'RM'], x: 70, y: 40 },
        { id: 'pos7', label: 'LB', valid: ['LB', 'LWB', 'CB', 'LM'], x: 15, y: 70 },
        { id: 'pos8', label: 'LCB', valid: ['CB', 'CDM', 'LB'], x: 35, y: 75 },
        { id: 'pos9', label: 'RCB', valid: ['CB', 'CDM', 'RB'], x: 65, y: 75 },
        { id: 'pos10', label: 'RB', valid: ['RB', 'RWB', 'CB', 'RM'], x: 85, y: 70 },
        { id: 'pos11', label: 'GK', valid: ['GK'], x: 50, y: 92 }
    ],
    '4-4-2': [
        { id: 'pos1', label: 'LST', valid: ['ST', 'CF'], x: 35, y: 15 },
        { id: 'pos2', label: 'RST', valid: ['ST', 'CF'], x: 65, y: 15 },
        { id: 'pos3', label: 'LM', valid: ['LM', 'LW', 'CM'], x: 15, y: 40 },
        { id: 'pos4', label: 'LCM', valid: ['CM', 'CDM', 'CAM'], x: 35, y: 45 },
        { id: 'pos5', label: 'RCM', valid: ['CM', 'CDM', 'CAM'], x: 65, y: 45 },
        { id: 'pos6', label: 'RM', valid: ['RM', 'RW', 'CM'], x: 85, y: 40 },
        { id: 'pos7', label: 'LB', valid: ['LB', 'LWB', 'CB'], x: 15, y: 75 },
        { id: 'pos8', label: 'LCB', valid: ['CB', 'CDM'], x: 35, y: 80 },
        { id: 'pos9', label: 'RCB', valid: ['CB', 'CDM'], x: 65, y: 80 },
        { id: 'pos10', label: 'RB', valid: ['RB', 'RWB', 'CB'], x: 85, y: 75 },
        { id: 'pos11', label: 'GK', valid: ['GK'], x: 50, y: 92 }
    ],
    '3-4-3': [
        { id: 'pos1', label: 'LW', valid: ['LW', 'LM', 'ST', 'CF'], x: 20, y: 15 },
        { id: 'pos2', label: 'ST', valid: ['ST', 'CF'], x: 50, y: 10 },
        { id: 'pos3', label: 'RW', valid: ['RW', 'RM', 'ST', 'CF'], x: 80, y: 15 },
        { id: 'pos4', label: 'LM', valid: ['LM', 'LWB', 'LW', 'CM'], x: 15, y: 45 },
        { id: 'pos5', label: 'LCM', valid: ['CM', 'CDM', 'CAM'], x: 35, y: 50 },
        { id: 'pos6', label: 'RCM', valid: ['CM', 'CDM', 'CAM'], x: 65, y: 50 },
        { id: 'pos7', label: 'RM', valid: ['RM', 'RWB', 'RW', 'CM'], x: 85, y: 45 },
        { id: 'pos8', label: 'LCB', valid: ['CB', 'LB'], x: 25, y: 75 },
        { id: 'pos9', label: 'CB', valid: ['CB', 'CDM'], x: 50, y: 80 },
        { id: 'pos10', label: 'RCB', valid: ['CB', 'RB'], x: 75, y: 75 },
        { id: 'pos11', label: 'GK', valid: ['GK'], x: 50, y: 92 }
    ]
};
