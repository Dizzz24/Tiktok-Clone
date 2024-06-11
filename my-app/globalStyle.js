import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({
    vh: {
        height
    },
    vw: {
        width
    },
    detailPost: {
        position: 'absolute',
        height,
        width,
    },
    titleCard: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loading: {
        position: 'absolute',
        zIndex: 5,
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    // navbar 
    profilecontainer: {
        paddingVertical: 20,
        alignItems: 'center',
        paddingHorizontal: 65,
        borderBottomWidth: 1,
        borderColor: 'lightgray'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    counterContainer: {
        paddingBottom: 20,
        flexDirection: 'row',
    },
    counterItemContainer: {
        flex: 1,
        alignItems: 'center'
    },
    name: {
        padding: 16,
        fontSize: 24
    },
    counterNumberText: {
        fontWeight: 'bold',
        fontSize: 20
    },
    counterLabelText: {
        color: 'gray',
        fontSize: 11
    },
    navContainer: {
        width,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: 'lightgray'
    },
    navText: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        backgroundColor: '#e8ecf4',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    titleForm: {
        fontSize: 72,
        fontWeight: '800',
        color: '#1D2A32',
        marginBottom: 2,
        paddingHorizontal: 18,
    },
    subtitle: {
        fontSize: 48,
        fontWeight: '800',
        color: '#333',
    },
    /** Header */
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16
    },
    /** Form */
    form: {
        marginBottom: 24,
        paddingHorizontal: 40,
    },
    formAction: {
        marginTop: 24,
        marginBottom: 16,
    },
    formLink: {
        fontSize: 32,
        fontWeight: '600',
        color: '#075eec',
        textAlign: 'center',
    },
    formFooterContainer: {
        marginTop: 'auto',
        marginBottom: 10,
        alignItems: 'center',
    },
    formFooter: {
        fontSize: 24,
        fontWeight: '600',
        color: '#222',
        letterSpacing: 0.15,
    },
    /** Input */
    formInput: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 24,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputControl: {
        height: 80,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 30,
        fontWeight: '500',
        color: '#222',
        borderWidth: 1,
        borderColor: '#C9D3DB',
        borderStyle: 'solid',
    },
    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        height: 80,
        borderWidth: 1,
        backgroundColor: '#075eec',
        borderColor: '#075eec',
    },
    btnText: {
        fontSize: 30,
        lineHeight: 32,
        fontWeight: '600',
        color: '#fff',
    },
    // Post style
    postContainer: {
        flex: 1,
        marginTop: -46,
    },
    postItem: {
        height,
        width,
        position: 'relative',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white'
    },
    content: {
        fontSize: 16,
        color: 'white'
    },
    overlay: {
        top: '50%'
    },
    modal: {
        position: 'absolute',
        height: height / 2.3,
        width,
        bottom: 0,
        backgroundColor: "#fff",
        zIndex: 5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentContainer: {
        height: '95%',
        width: '95%',
        backgroundColor: "blue",
        gap: 20
    },
    comment: {
        width: "100%",
        backgroundColor: "red",
        padding: 20
    },
    actionContainer: {
        position: 'absolute',
        height: height / 2.5,
        // backgroundColor: "white",
        bottom: 0,
        right: 0,
        padding: 16,
        // flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        // backgroundColor: "#333"
    },
    profileButton: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: 'yellow',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'white',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    count: {
        fontSize: 18,
        color: 'white'
    }
})

export const buttonStyles = StyleSheet.create({
    grayOutlinedButton: {
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 30
    },
    grayOutlinedButtonText: {
        color: 'black',
        fontWeight: '700'
    },
    filledButton: {
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 50,
        backgroundColor: '#ff4040'
    },
    filledButtonText: {
        color: 'white',
        fontWeight: '700'
    }
});
