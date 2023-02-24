import { DropDown } from '@mth/models'

export const dropdownMock: DropDown[] = [
    {
        testId: "dropdown",
        dropDownItems: [
            { value: 'value1', label: 'label1' },
            { value: 'value2', label: 'label2' },
        ],
        setParentValue: jest.fn(),
        placeholder: "select",
        placeholderColor: '#A3A3A4',
        alternate: true,
        size: 'small',
        defaultValue: "value1",
        name: 'name',
        disabled: false,
        dropdownColor: '#A3A3A4',
        color: '#A3A3A4',
        isAddable: true,
        auto: true,
        borderNone: true,
        id: 'select-id',
        labelTopColor: 'red',
        labelTopBgColor: 'white',
    },
    {
        testId: "dropdown-2",
        dropDownItems: [
            { value: 'value1', label: 'label1' },
            { value: 'value2', label: 'label2' },
        ],
        setParentValue: jest.fn(),
        placeholder: "Select with blue",
        labelTop: true,
        alternate: true,
        size: 'small',
        defaultValue: "value1",
        name: 'name',
        disabled: false,
        id: 'select-id',
        labelTopColor: 'rgb(25, 118, 210)',
        labelTopBgColor: 'white',
    }
];

