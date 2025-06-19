import React, { useState, useEffect, useRef } from 'react';
import { db, storage, auth, functions } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import './ChatComponent.css';

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  // 현재 인증된 사용자 추적
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.uid : "Not logged in");
      setCurrentUser(user);
    });
    
    return () => unsubscribe();
  }, []);

  // 메시지 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 사용자별 메시지 불러오기
  useEffect(() => {
    if (!currentUser) {
      console.log("No user logged in, skipping message load");
      return; 
    }
    
    console.log("Setting up message listener for user:", currentUser.uid);
    
    const messagesRef = collection(db, "userMessages");
    const q = query(
      messagesRef,
      where("userId", "==", currentUser.uid),
      orderBy("timestamp", "asc")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Message snapshot received, count:", querySnapshot.size);
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
      scrollToBottom();
    }, (error) => {
      console.error("Messages loading error:", error);
      alert("메시지를 불러오는 중 오류가 발생했습니다: " + error.message);
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 메시지 전송 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      console.error("No user logged in");
      alert("로그인이 필요합니다.");
      return;
    }
    
    if ((!newMessage.trim() && !imageFile) || isLoading) {
      console.log("Empty message or already loading");
      return;
    }
    
    setIsLoading(true);
    console.log("Attempting to send message for user:", currentUser.uid);
    
    try {
      let imageUrl = null;
      
      // 이미지 파일이 있으면 Storage에 업로드
      if (imageFile) {
        console.log("Uploading image file");
        const storageRef = ref(storage, `mission_images/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("Image uploaded, URL:", imageUrl);
      }
      
      // 사용자 메시지 저장
      const messageData = {
        text: newMessage,
        imageUrl: imageUrl,
        sender: "user",
        userId: currentUser.uid,
        timestamp: serverTimestamp()
      };
      
      console.log("Saving message:", messageData);
      const docRef = await addDoc(collection(db, "userMessages"), messageData);
      console.log("Message saved with ID:", docRef.id);
      
      // 입력값 초기화
      setNewMessage('');
      setImageFile(null);
      setImagePreview(null);
      
      // Cloud Function 호출하여 챗봇 응답 생성
      try {
        console.log("Calling Cloud Function processMessage");
        const processMessageFunction = httpsCallable(functions, 'processMessage');
        
        const result = await processMessageFunction({
          message: newMessage,
          userId: currentUser.uid,
          messageId: docRef.id
        });
        
        console.log("Cloud Function response:", result.data);
      
      } catch (error) {
        console.error("Cloud Function error details:", error);
        
        // 더 구체적인 에러 메시지
        let errorMessage = "응답 생성 중 오류가 발생했습니다.";
        if (error.code === 'unauthenticated') {
          errorMessage = "인증이 필요합니다. 다시 로그인해주세요.";
        } else if (error.code === 'invalid-argument') {
          errorMessage = "잘못된 요청입니다.";
        }

        // 에러 발생 시 기본 응답 제공
        const fallbackResponse = {
          text: errorMessage,
          sender: "bot",
          userId: currentUser.uid,
          timestamp: serverTimestamp(),
          error: true
        };
        
        await addDoc(collection(db, "userMessages"), fallbackResponse);
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      alert(`메시지 전송 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 테스트용 초기 메시지 전송 함수
  const sendTestMessage = async () => {
    if (!currentUser) return;
    
    try {
      console.log("Sending test message for user:", currentUser.uid);
      await addDoc(collection(db, "userMessages"), {
        text: "테스트 메시지입니다.",
        sender: "user",
        userId: currentUser.uid,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending test message:", error);
    }
  };

  return (
    <div className="chat-container">
      {/* 로그인 상태 표시 및 테스트 버튼 */}
      <div className="status-bar">
        <div>
          {currentUser ? 
            `로그인됨: ${currentUser.email}` : 
            "로그인되지 않음"
          }
        </div>
        {currentUser && (
          <button onClick={sendTestMessage} className="test-button">
            테스트 메시지
          </button>
        )}
      </div>
      
      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="empty-messages">
            메시지가 없습니다. 첫 메시지를 보내보세요!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-content">
                {msg.text && <p>{msg.text}</p>}
                {msg.imageUrl && (
                  <img 
                    src={msg.imageUrl} 
                    alt="Uploaded content" 
                    className="message-image"
                  />
                )}
              </div>
              <div className="message-time">
                {msg.timestamp?.toDate()?.toLocaleTimeString() || "전송 중..."}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            disabled={isLoading || !currentUser}
          />
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="image-upload"
            style={{ display: 'none' }}
            disabled={isLoading || !currentUser}
          />
          <label htmlFor="image-upload" className="upload-button">
            📷
          </label>
        </div>
        
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button 
              type="button" 
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              className="remove-image"
            >
              ❌
            </button>
          </div>
        )}
        
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !currentUser}
        >
          {isLoading ? '전송 중...' : '전송'}
        </button>
      </form>
    </div>
  );
}

export default ChatComponent;