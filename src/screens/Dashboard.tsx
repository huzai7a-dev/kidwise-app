import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    View,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Image,
    TouchableOpacity
} from "react-native";
import BottomNavBar from "@src/components/BottomNavbar";
import Header from "@src/components/Header";
import KWText from "@src/components/KWText";
import { theme } from "@src/constants/colors";
import CategoryCard from "@src/components/CategoryCard";
import { bannerData } from "@src/constants/banner";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "@src/types/navigation";

const { width } = Dimensions.get('window');

type BannerItem = {
    id: string;
    image: string;
};

type CategoryItem = {
    id: string;
    title: string;
    icon: string;
    color: string;
};

const categoryData: CategoryItem[] = [
    { id: '1', title: 'Rhymes/Songs', icon: '🎵', color: theme.orange },
    { id: '2', title: 'Learning Activities', icon: '📚', color: theme.blue },
    { id: '3', title: 'Animal Recognition', icon: '🦁', color: theme.pink },
    { id: '4', title: 'Object Recognition', icon: '🍎', color: theme.purple },
    { id: '5', title: 'Holiday Content', icon: '🎄', color: theme.orange },
];

const Dashboard = () => {
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const [activeIndex, setActiveIndex] = useState(0);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const startAutoScroll = () => {
            interval = setInterval(() => {
                setActiveIndex(prevIndex => {
                    const nextIndex = (prevIndex + 1) % bannerData.length;
                    flatListRef.current?.scrollToIndex({
                        index: nextIndex,
                        animated: true,
                    });
                    return nextIndex;
                });
            }, 3000);
        };
        startAutoScroll();
        return () => clearInterval(interval);
    }, []);

    const renderBannerItem = ({ item }: { item: BannerItem }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("stories", { id: item.id })}
            style={styles.bannerCard}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.bannerImage}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );
    const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
        <CategoryCard item={item} />
    );

    return (
        <View style={styles.container}>

            <Header childName="Alex" onProfilePress={() => navigation.navigate("profile")} onNotificationPress={() => navigation.navigate("notification")} />

            <ScrollView contentContainerStyle={styles.scrollViewContent}>


                <View style={styles.section}>
                    <FlatList
                        ref={flatListRef}
                        data={bannerData}
                        renderItem={renderBannerItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                        onMomentumScrollEnd={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                            setActiveIndex(newIndex);
                        }}
                    />
                    <View style={styles.pagination}>
                        {bannerData.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.paginationDot,
                                    i === activeIndex ? styles.paginationDotActive : {},
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <KWText style={styles.sectionTitle}>Child's Progress</KWText>
                    <View style={styles.progressCard}>
                        <KWText style={styles.progressText}>Reading Level: Beginner</KWText>
                        <KWText style={styles.progressText}>Activities Completed: 15</KWText>
                        <KWText style={styles.progressText}>Next Goal: Learn 5 new words!</KWText>
                        <View style={styles.progressBarBackground}>
                            <View style={[styles.progressBarFill, { width: '60%' }]} />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <KWText style={styles.sectionTitle}>Learning Categories</KWText>
                    <FlatList
                        data={categoryData}
                        renderItem={renderCategoryItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryListContent}
                    />
                </View>
            </ScrollView>

            <BottomNavBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    section: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.black,
        marginBottom: 15,
    },
    bannerCard: {
        width: width - 40,
        height: 200,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.gray,
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: theme.purple,
    },
    progressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    progressText: {
        fontSize: 16,
        color: theme.black,
        marginBottom: 8,
    },
    progressBarBackground: {
        height: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        marginTop: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.blue,
        borderRadius: 5,
    },
    categoryListContent: {
        paddingRight: 10,
    },
    categoryCardWrapper: {
        marginRight: 15,
    },
    categoryCard: {
        width: 120,
        height: 120,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    categoryIcon: {
        fontSize: 40,
        marginBottom: 10,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default Dashboard;
