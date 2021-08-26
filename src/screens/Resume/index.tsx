import React, {useEffect, useCallback} from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

import { HistoryCard } from '../../components/HistoryCard'

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer,
} from './styles'

import { useTheme } from 'styled-components';

import { categories } from '../../utils/categories';
import { useState } from 'react';
import { date, number } from 'yup/lib/locale';


interface TransactionData{
    type: 'positive' | 'negative'
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData{
    key:string;
    name: string;
    totalFormated: string;
    total: number;
    color: string;
    percent: string;
}

export function Resume(){

    const theme = useTheme();

    const[isLoading, setIsloading] = useState(false);
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    function handleDateChange(action: 'next' | 'prev'){
        
        if(action === 'next'){
            setSelectedDate(addMonths(selectedDate, 1));
        }else{
            setSelectedDate(subMonths(selectedDate, 1));            
        }
    }

    async function loadData() {
        setIsloading(true);
        const datakey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(datakey);
        const responseFormated = response ? JSON.parse(response) : [];

        const expensives = responseFormated.filter((expensive: TransactionData) => 
            expensive.type === 'negative' && 
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear() 
        );

        const expensiveTotal = expensives.reduce((acumullator: number, expensive:TransactionData) =>{
            return acumullator + Number(expensive.amount);
        },0 )

        const totalByCategory:CategoryData[] = [];
        
        categories.forEach(category => {

            let categorySum = 0;

            expensives.forEach((expensive:TransactionData) => {
                if(expensive.category === category.key){
                    categorySum += Number(expensive.amount);
                }
            });

            if(categorySum > 0 ){

                const totalFormated = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }) 

                const percent = `${(categorySum / expensiveTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key:category.key,
                    name:category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormated,
                    percent
                });
            }

        });

        setTotalByCategories(totalByCategory);
        setIsloading(false);
    }
    

    useFocusEffect(useCallback(()=>{
        loadData();
    }, [selectedDate]));

    return(
        <Container>
        
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {
             isLoading ? 
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.color.primary}
                        size='large'
                    />
                </LoadContainer> :
                
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight()
                    }}
                >
                    <MonthSelect>

                        <MonthSelectButton onPress={() => handleDateChange('prev')}>
                            <MonthSelectIcon name='chevron-left'/>
                        </MonthSelectButton>

                        <Month>
                            { format (selectedDate, 'MMMM, yyyy', {locale: ptBR})}
                        </Month>

                        <MonthSelectButton onPress={() => handleDateChange('next')}>
                            <MonthSelectIcon name='chevron-right'/>
                        </MonthSelectButton>

                    </MonthSelect>


                    <ChartContainer>
                        <VictoryPie
                            data={totalByCategories}
                            colorScale={totalByCategories.map(category => category.color)}
                            style={{
                                labels:{
                                    fontSize: RFValue(18),
                                    fontWeight: 'bold',
                                    fill: theme.color.shape
                                } 
                            }}
                            labelRadius={50}
                            x='percent'
                            y='total'
                        />
                    </ChartContainer>

                    {
                        totalByCategories.map(item =>(
                            <HistoryCard
                                key={item.key}
                                title={item.name}
                                amount={item.totalFormated}
                                color= {item.color}
                            />
                        ))
                        
                    }
                </Content>
                
            }
        </Container>
    )
}