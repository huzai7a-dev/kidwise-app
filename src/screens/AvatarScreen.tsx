import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { registerGlobals, LiveKitRoom, VideoTrack, useTracks, isTrackReference, AudioSession } from '@livekit/react-native';
import { Track } from 'livekit-client';

registerGlobals();

export default function AvatarScreen() {
    const [wsUrl, setWsUrl] = useState('');
    const [token, setToken] = useState('');
    const [sessionToken, setSessionToken] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [connected, setConnected] = useState(false);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    // ✅ Start Audio Session
    useEffect(() => {
        AudioSession.startAudioSession().catch(err => console.error(err));
        return () => {
            AudioSession.stopAudioSession().catch(err => console.error(err));
        };
    }, []);

    const createSession = async () => {
        try {
            setLoading(true);

            // Get token from your backend
            const tokenResp = await fetch('http://192.168.100.66:4000/api/start-avatar', {
                method: 'POST',
            });
            const tokenData = await tokenResp.json();
            const newToken = tokenData.token;
            setSessionToken(newToken);

            // Create HeyGen session
            const response = await fetch('https://api.heygen.com/v1/streaming.new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${newToken}`,
                },
                body: JSON.stringify({
                    quality: 'high',
                    version: 'v2',
                    video_encoding: 'H264',
                }),
            });
            const data = await response.json();

            setSessionId(data.data.session_id);
            setWsUrl(data.data.url);
            setToken(data.data.access_token);

            // Start streaming session
            await fetch('https://api.heygen.com/v1/streaming.start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${newToken}`,
                },
                body: JSON.stringify({ session_id: data.data.session_id }),
            });

            setConnected(true);
        } catch (err) {
            console.error('Error creating session:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendText = async () => {
        if (!text.trim()) return;

        try {
            setSpeaking(true);
            await fetch('https://api.heygen.com/v1/streaming.task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify({ session_id: sessionId, text, task_type: 'talk' }),
            });
            setText('');
        } catch (err) {
            console.error('Error sending text:', err);
        } finally {
            setSpeaking(false);
        }
    };

    const closeSession = async () => {
        try {
            setLoading(true);
            await fetch('https://api.heygen.com/v1/streaming.stop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify({ session_id: sessionId }),
            });

            setConnected(false);
            setSessionId('');
            setSessionToken('');
            setWsUrl('');
            setToken('');
            setText('');
            setSpeaking(false);
        } catch (err) {
            console.error('Error closing session:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!connected) {
        return (
            <SafeAreaView style={styles.startContainer}>
                <Text style={styles.title}>HeyGen Live Avatar</Text>
                <TouchableOpacity style={styles.startButton} onPress={createSession} disabled={loading}>
                    <Text style={styles.startButtonText}>{loading ? 'Starting...' : 'Start Session'}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <LiveKitRoom serverUrl={wsUrl} token={token} connect audio={false} video={false}>
            <RoomView
                text={text}
                onTextChange={setText}
                onSendText={sendText}
                onClose={closeSession}
                speaking={speaking}
                loading={loading}
            />
        </LiveKitRoom>
    );
}

const RoomView = ({ text, onTextChange, onSendText, onClose, speaking, loading }: {
    text: string;
    onTextChange: (val: string) => void;
    onSendText: () => void;
    onClose: () => void;
    speaking: boolean;
    loading: boolean;
}) => {
    const tracks = useTracks([Track.Source.Camera], { onlySubscribed: true });

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.videoContainer}>
                    {tracks.map((track, idx) =>
                        isTrackReference(track) ? (
                            <VideoTrack key={idx} style={styles.videoView} trackRef={track} objectFit="contain" />
                        ) : null
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.closeButton, loading && styles.disabledButton]}
                    onPress={onClose}
                    disabled={loading}
                >
                    <Text style={styles.closeButtonText}>{loading ? 'Closing...' : 'Close Session'}</Text>
                </TouchableOpacity>

                <View style={styles.controls}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter text for avatar"
                        value={text}
                        onChangeText={onTextChange}
                        editable={!speaking && !loading}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (speaking || !text.trim() || loading) && styles.disabledButton]}
                        onPress={onSendText}
                        disabled={speaking || !text.trim() || loading}
                    >
                        <Text style={styles.sendButtonText}>{speaking ? 'Speaking...' : 'Send'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    startContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 22, fontWeight: '700', color: '#1a73e8', marginBottom: 20, textAlign: 'center' },
    startButton: { backgroundColor: '#2196F3', padding: 16, borderRadius: 30 },
    startButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    videoContainer: { flex: 1 },
    videoView: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    closeButton: { position: 'absolute', top: 50, right: 20, backgroundColor: '#ff4444', padding: 12, borderRadius: 25 },
    closeButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    controls: { flexDirection: 'row', padding: 20, gap: 10 },
    input: { flex: 1, height: 50, borderWidth: 1, borderColor: '#333', borderRadius: 25, paddingHorizontal: 15 },
    sendButton: { backgroundColor: '#2196F3', paddingHorizontal: 20, justifyContent: 'center', borderRadius: 25 },
    sendButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    disabledButton: { opacity: 0.5 },
});
