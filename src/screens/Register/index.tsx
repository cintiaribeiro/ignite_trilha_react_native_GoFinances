import React, { useState } from 'react';
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import { TransitionTypeButton } from '../../components/Forms/TransitionTypeButton';
import { Button } from '../../components/Forms/Button';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { InputForm } from '../../components/Forms/InputForm'; 

import { CategorySelect } from '../CategorySelect'

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles';

interface FormData{
    name: string;
    amount: string
}

type NavigationProps = {
    navigate: (screen: string) => void;
}
const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('Nome é obrigatório'),

    amount: Yup
        .number()
        .typeError('Informe um valor numérico')
        .positive('O valor não pode ser negativo')
        .required('O valor é obrigatório'),

});

export function Register(){

    const datakey = '@gofinances:transactions';
        
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const navigation = useNavigation<NavigationProps>();

    const{control, reset, handleSubmit, formState:{ errors }} = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionsTypeSelect(type: 'positive' | 'negative'){
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }
    

    async function handleRegister(form: FormData){

            
        if(!transactionType)
            return Alert.alert('Selecione o tipo de transação');           
            
        if (category.key === 'category')
            return Alert.alert('Selecione a categoria');
        
        const newTransaction ={
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }
        

        try{
            const data = await AsyncStorage.getItem(datakey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormat = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(datakey, JSON.stringify(dataFormat));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });

            navigation.navigate("Listagem");

        }catch(error){
            console.log(error);
            Alert.alert('Não foi possível salvar');
        }
    }   

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>
                        Cadastro
                    </Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />
                        <TransactionTypes>
                            <TransitionTypeButton
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionsTypeSelect('positive')}
                                isActive = { transactionType === 'positive'}
                            />
                            <TransitionTypeButton
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionsTypeSelect('negative')}
                                isActive = { transactionType === 'negative'}
                            />
                        </TransactionTypes>
                        <CategorySelectButton 
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>
                    <Button 
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>
                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={ category }
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
}