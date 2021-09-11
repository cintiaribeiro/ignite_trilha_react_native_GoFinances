import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; 

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { useTheme } from 'styled-components';


import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LogoutButton,
    LoadContainer

} from './styles'
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps{
    id: string
}

interface Highlight {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: Highlight;
    expensives: Highlight;
    total: Highlight
}

export function Dashboard(){

    const [isLoading, setIsLoading] = useState(true);

    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();
    const { signOut, user } = useAuth();

    function getLastTransactionDate(collection:DataListProps[], type: 'positive' | 'negative' ){

        const collectionFiltered = collection
        .filter(transaction => transaction.type === type);

        if(collectionFiltered.length === 0 )
            return 0;

        const lastTransaction = new Date(Math.max.apply(Math, collectionFiltered
            .map(transaction  => new Date(transaction.date).getTime())));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`
    }

    async function loadTransaction(){
        const datakey =  `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(datakey);

        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionFormatted:DataListProps[]  = transactions.map((item: DataListProps)=>{

            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            }else{
                expensiveTotal += Number(item.amount);
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const date  = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit' 
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        });

        setTransactions(transactionFormatted);

        const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionsExpensives = getLastTransactionDate(transactions, 'negative');

        const totalInterval = lastTransactionsExpensives === 0 ? 'Não há transações' : `01 a ${lastTransactionsExpensives}`

        let total = entriesTotal - expensiveTotal;

        setHighlightData(
            {
                entries:{
                    amount: entriesTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: lastTransactionsEntries === 0 
                        ? 'Não há transações' 
                        : `Última entrada dia ${lastTransactionsEntries}`
                },
                expensives: {
                    amount: expensiveTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: lastTransactionsExpensives === 0 
                        ? 'Não há transações'
                        : `Última saída dia ${lastTransactionsExpensives}`
                },
                total: {
                    amount: total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                    lastTransaction: totalInterval
                    
                }
            }
        );

        setIsLoading(false);
    }

    useEffect(()=>{
        loadTransaction();
    },[]);

    useFocusEffect(useCallback(()=>{
        loadTransaction();
    }, []));

    return(
        <Container>
            {
                isLoading ? 
                    <LoadContainer>
                        <ActivityIndicator 
                            color={theme.color.primary}
                            size='large'
                        />
                    </LoadContainer> :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo source={{uri: user.photo}}/>
                                <User>
                                    <UserGreeting>Olá,</UserGreeting>
                                    <UserName>{user.name}</UserName>
                                </User>
                            </UserInfo>
                            <LogoutButton onPress={ signOut }>
                                <Icon name='power'/>                    
                            </LogoutButton>
                                
                        </UserWrapper>
                    </Header>

                    <HighlightCards>  
                        <HighlightCard
                            type='up'
                            title='Entradas'
                            amount={highlightData.entries.amount}
                            lastTransaction= {highlightData.entries.lastTransaction}
                        />  
                        <HighlightCard
                            type='down'
                            title='Saída'
                            amount={highlightData.expensives.amount}
                            lastTransaction= {highlightData.expensives.lastTransaction}
                        />  
                        <HighlightCard
                            type='total'
                            title='Tota;'
                            amount={highlightData.total.amount}
                            lastTransaction= {highlightData.total.lastTransaction}
                        />  
                    </HighlightCards>

                    <Transactions>

                    <Title>Listagem</Title>
                    
                    <TransactionsList
                        data={transactions}
                        keyExtractor={item => item.id}
                        renderItem={({ item })=> <TransactionCard data={item}/>}
                        
                    />
                
                </Transactions>
            </>
        }
        </Container>
    )
}