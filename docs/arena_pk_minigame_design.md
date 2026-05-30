# Thiết kế lại Arena PK thành chuỗi mini game hóa học tương tác

## 1. Mục tiêu thiết kế

Arena PK không còn là một trận trả lời trắc nghiệm tuần tự. Mỗi ván đấu là một chuỗi thử thách hóa học tương tác, trong đó người chơi phải thao tác trực tiếp với mô hình, công thức, dụng cụ, nguyên tử, electron hoặc hiện tượng phản ứng để hoàn thành nhiệm vụ.

Thiết kế mới cần đạt các mục tiêu:

- Một ván PK có thể trộn nhiều dạng mini game khác nhau.
- Số lượng nhiệm vụ trong ván không bị cố định, mà phụ thuộc chế độ chơi, độ khó, thời gian, cấp độ hoặc cấu hình hệ thống.
- Mọi đáp án, logic chấm điểm và kết quả đúng sai phải do backend quyết định.
- Frontend chỉ render mô hình tương tác từ payload đã được sanitize.
- Có thể mở rộng thêm game type mới mà không phải viết lại toàn bộ Arena.
- Trận đấu có tính cạnh tranh cao nhưng vẫn phục vụ mục tiêu học tập: phản hồi, giải thích và gợi ý sau mỗi lượt.

## 2. Vòng đời phòng PK

Trạng thái phòng nên được chuẩn hóa thành state machine:

```txt
lobby -> matchmaking -> preparing -> countdown -> playing -> resolving -> finished
```

Ý nghĩa từng trạng thái:

- `lobby`: người chơi tạo phòng, chọn mode, độ khó, chủ đề, thời lượng hoặc cấu hình đặc biệt.
- `matchmaking`: hệ thống ghép đối thủ theo rank, lớp, cấp độ, độ khó mong muốn và độ trễ kết nối.
- `preparing`: backend khóa danh sách người chơi, sinh chuỗi mini game, tạo seed trận và tạo các task instance.
- `countdown`: tất cả client đồng bộ đồng hồ server trước khi bắt đầu.
- `playing`: người chơi thực hiện các mini game theo từng round.
- `resolving`: backend chấm round, tổng hợp điểm, gửi feedback và lời giải.
- `finished`: xác định thắng thua, cập nhật rank, nhiệm vụ ngày, lịch sử trận và replay tóm tắt.

## 3. Cấu hình trận đấu

Mỗi trận nên có một `match_config` thay vì hard-code số câu hỏi:

```json
{
  "mode": "solo",
  "ranked": true,
  "difficulty": "auto",
  "topicPool": ["stoichiometry", "atomic_structure", "reactions"],
  "taskCount": 7,
  "totalTimeSeconds": 420,
  "perTaskTimeMode": "template",
  "allowedGameTypes": [
    "balancing",
    "atom_match",
    "electron_match",
    "calculation",
    "lab_simulation",
    "classification",
    "phenomenon"
  ],
  "distribution": {
    "balancing": 2,
    "calculation": 2,
    "atom_match": 1,
    "electron_match": 1,
    "phenomenon": 1
  },
  "scoringProfile": "ranked_standard"
}
```

Các mode mẫu:

| Mode | Người chơi | Task gợi ý | Thời gian | Ghi chú |
| --- | ---: | ---: | ---: | --- |
| `practice` | 1 | 5-8 | Không rank | Dùng luyện tập, có gợi ý nhiều hơn |
| `solo` | 2 | 5-7 | 4-7 phút | PK nhanh, dễ ghép trận |
| `3vs3` | 6 | 7-10 | 7-10 phút | Vẫn tính điểm cá nhân và điểm đội |
| `5vs5` | 10 | 10-12 | 10-14 phút | Phù hợp sự kiện hoặc lớp học |
| `boss` | Nhiều | Theo boss | Theo event | Cả lớp đánh một chuỗi thử thách lớn |

## 4. Cơ chế ghép trận

Arena nên hỗ trợ ba cách vào trận:

| Cách vào trận | Mục đích | Cách hoạt động |
| --- | --- | --- |
| Quick match | PK nhanh | Người chơi chọn mode, hệ thống đưa vào hàng đợi phù hợp |
| Custom room | Chơi với bạn/lớp | Chủ phòng chọn cấu hình, người khác vào bằng mã phòng |
| Practice | Luyện tập một mình | Tạo phòng local/server một người, không cộng rank |

### 4.1. Hàng đợi quick match

Khi người chơi bấm tìm trận, backend tạo một queue ticket:

```json
{
  "userId": "user_123",
  "mode": "solo",
  "ranked": true,
  "gradeLevel": 9,
  "rankPoints": 1280,
  "preferredDifficulty": "auto",
  "topicPool": ["stoichiometry", "atomic_structure"],
  "joinedAt": "2026-05-31T10:00:00Z"
}
```

Backend ghép theo điểm tương thích:

```txt
matchScore =
  rankDistanceWeight
  + gradeDistanceWeight
  + waitTimeExpansion
  + topicOverlapWeight
  + latencyWeight
```

Nguyên tắc:

- Trong 10 giây đầu, ưu tiên đối thủ gần rank và cùng lớp.
- Sau 10-30 giây, mở rộng khoảng rank và lớp liền kề.
- Sau 30 giây, có thể ghép rộng hơn trong casual, nhưng ranked vẫn giới hạn để tránh lệch trình.
- Không ghép lại ngay với cùng một đối thủ nếu vừa đánh xong nhiều trận liên tiếp.
- Với mode team, ưu tiên cân bằng tổng rank hai đội thay vì chỉ ghép đủ người.

### 4.2. Custom room

Custom room cho lớp học hoặc nhóm bạn:

- Chủ phòng chọn mode, số người, chủ đề, độ khó, task count và ranked/casual.
- Nếu là giáo viên/admin, có thể tạo room theo lớp và bật spectator.
- Người chơi vào bằng mã phòng.
- Khi đủ người hoặc chủ phòng bấm bắt đầu, backend sinh chuỗi mini game.
- Nếu room là ranked, config phải nằm trong giới hạn hệ thống để tránh farm điểm.

### 4.3. Practice room

Practice dùng cùng renderer mini game nhưng khác luật:

- Cho phép chơi một mình.
- Có thể retry nhiều lần.
- Có thể hiện hint chi tiết.
- Có thể xem lời giải ngay sau mỗi attempt.
- Không cập nhật rank, win/loss hoặc leaderboard PK.
- Vẫn có thể lưu tiến độ học tập, mastery và nhiệm vụ luyện tập.

### 4.4. Team mode

Với `3vs3` và `5vs5`, backend cần chia đội trước khi sinh trận:

```txt
teamA và teamB có tổng rank càng gần nhau càng tốt
```

Nếu người chơi vào theo party, hệ thống giữ party cùng đội nếu có thể. Điểm cuối trận gồm cả điểm cá nhân và điểm đội để tránh người chơi yếu bị vô nghĩa trong trận.

## 5. Ngân hàng mini game

Không nên lưu mọi thứ trong bảng `arena_questions` theo kiểu câu hỏi trắc nghiệm. Nên tách thành template nhiệm vụ.

### 5.1. Game template

```json
{
  "id": "balancing_fe_o2_fe3o4_medium",
  "gameType": "balancing",
  "topic": "chemical_equations",
  "gradeLevel": 9,
  "difficulty": "medium",
  "estimatedSeconds": 55,
  "basePoints": 150,
  "prompt": "Cân bằng phản ứng: Fe + O2 -> Fe3O4",
  "payload": {
    "equation": {
      "reactants": ["Fe", "O2"],
      "products": ["Fe3O4"]
    },
    "minCoefficient": 1,
    "maxCoefficient": 8,
    "visualModel": "atom_counter"
  },
  "answer": {
    "coefficients": [3, 2, 1]
  },
  "rubric": {
    "partialCredit": true,
    "maxAttempts": 3
  },
  "explanation": "3Fe + 2O2 -> Fe3O4 cân bằng 3 Fe và 4 O ở hai vế."
}
```

`payload` là dữ liệu client được phép nhận. `answer`, `rubric` nhạy cảm và evaluator chi tiết chỉ dùng ở backend.

### 5.2. Game instance

Khi trận bắt đầu, backend không gửi trực tiếp template gốc mà tạo `game_instance`:

```json
{
  "id": "instance_123",
  "roomId": "924681",
  "roundIndex": 0,
  "templateId": "balancing_fe_o2_fe3o4_medium",
  "gameType": "balancing",
  "seed": "locked-server-seed",
  "timeLimitSeconds": 55,
  "basePoints": 150,
  "status": "pending"
}
```

Game instance cho phép một template được tái sử dụng ở nhiều trận, nhưng mỗi trận có seed, thứ tự, thời gian và biến thể riêng.

## 6. Cách sinh chuỗi mini game trong một ván

Backend dùng pipeline sinh nhiệm vụ:

1. Nhận `match_config` từ phòng hoặc mode mặc định.
2. Tính `effectiveDifficulty` từ rank, lớp, level, lịch sử đúng sai và lựa chọn của phòng.
3. Lọc template theo `allowedGameTypes`, `topicPool`, `gradeLevel`, `difficulty`.
4. Tính phân bổ game type theo `distribution`.
5. Chọn template theo trọng số:
   - ưu tiên dạng người chơi ít gặp gần đây;
   - tránh lặp cùng topic quá nhiều;
   - giữ tổng `estimatedSeconds` gần `totalTimeSeconds`;
   - không đặt hai game quá khó liên tiếp ở đầu trận.
6. Shuffle có kiểm soát để chuỗi chơi đa dạng.
7. Tạo `arena_game_instances` và khóa danh sách round.
8. Gửi state đầu tiên cho client qua API, realtime chỉ đồng bộ trạng thái.

Ví dụ output cho một trận solo:

```json
[
  { "round": 1, "gameType": "balancing", "difficulty": "easy" },
  { "round": 2, "gameType": "calculation", "difficulty": "medium" },
  { "round": 3, "gameType": "atom_match", "difficulty": "easy" },
  { "round": 4, "gameType": "phenomenon", "difficulty": "medium" },
  { "round": 5, "gameType": "electron_match", "difficulty": "medium" },
  { "round": 6, "gameType": "calculation", "difficulty": "medium" },
  { "round": 7, "gameType": "balancing", "difficulty": "hard" }
]
```

## 7. Các mini game cốt lõi

### 7.1. Cân bằng phương trình hóa học

Người chơi điều chỉnh hệ số bằng nút tăng giảm hoặc nhập số trực tiếp.

Tương tác:

- Bấm tăng giảm hệ số trước mỗi chất.
- Bộ đếm nguyên tử hai vế cập nhật tức thì.
- Nguyên tố chưa cân bằng được tô đỏ, đã cân bằng tô xanh.
- Submit khi người chơi tự tin hoặc hết giờ.

Payload:

```json
{
  "equation": {
    "reactants": ["Fe", "O2"],
    "products": ["Fe3O4"]
  },
  "minCoefficient": 1,
  "maxCoefficient": 8,
  "visualModel": "atom_counter"
}
```

Submit:

```json
{
  "gameType": "balancing",
  "value": {
    "coefficients": [3, 2, 1]
  },
  "attemptCount": 1,
  "clientElapsedMs": 28140
}
```

Evaluator backend:

- So sánh vector hệ số sau khi rút gọn tỉ lệ.
- Kiểm tra cân bằng số nguyên tử từng nguyên tố.
- Có thể cho partial credit theo số nguyên tố cân bằng.

### 7.2. Ghép nguyên tử/phân tử

Người chơi kéo thả nguyên tử, ion hoặc liên kết vào slot để tạo phân tử/hợp chất đúng.

Tương tác:

- Kéo thẻ nguyên tử vào vị trí mô hình.
- Kéo liên kết đơn, đôi, ba nếu nhiệm vụ yêu cầu.
- Mô hình 2D/3D cập nhật khi slot được lấp.
- Slot sai có hiệu ứng rung hoặc viền đỏ, nhưng không lộ đáp án đầy đủ trong PK đang chạy.

Payload:

```json
{
  "formula": "H2O",
  "moleculeId": "h2o",
  "slots": [
    { "id": "center", "label": "Tâm phân tử" },
    { "id": "left", "label": "Nhánh trái" },
    { "id": "right", "label": "Nhánh phải" }
  ],
  "choices": [
    { "symbol": "H", "name": "Hiđro" },
    { "symbol": "O", "name": "Oxi" },
    { "symbol": "C", "name": "Cacbon" }
  ],
  "allowBondEditing": false
}
```

Submit:

```json
{
  "gameType": "atom_match",
  "value": {
    "placements": {
      "center": "O",
      "left": "H",
      "right": "H"
    }
  }
}
```

### 7.3. Ghép electron

Người chơi sắp xếp electron vào lớp vỏ, orbital hoặc hoàn thành cấu hình electron.

Tương tác:

- Kéo electron vào lớp K, L, M hoặc orbital.
- Atomic model cập nhật số electron trên từng lớp.
- Hệ thống cảnh báo nếu vượt sức chứa lớp vỏ.
- Với cấp cao, có thể chuyển sang orbital `1s`, `2s`, `2p`, `3s`.

Payload:

```json
{
  "symbol": "Na",
  "atomicNumber": 11,
  "mode": "shell",
  "shellLabels": ["K", "L", "M"],
  "visualModel": "atomic_model"
}
```

Submit:

```json
{
  "gameType": "electron_match",
  "value": {
    "shells": [2, 8, 1]
  }
}
```

### 7.4. Tính toán hóa học

Người chơi có thể nhập kết quả, chọn công thức, kéo thả bước tính hoặc hoàn thành quy trình giải.

Tương tác:

- Chọn công thức đúng từ nhiều công thức.
- Kéo dữ kiện vào công thức.
- Nhập kết quả từng bước hoặc kết quả cuối.
- Có sai số theo `tolerance`.

Payload:

```json
{
  "scenario": "Zn phản ứng với HCl dư tạo 2,24 L H2 ở đktc. Tính khối lượng Zn.",
  "given": [
    { "label": "V(H2)", "value": 2.24, "unit": "L" },
    { "label": "M(Zn)", "value": 65, "unit": "g/mol" }
  ],
  "formulaChoices": ["n = V / 22,4", "m = n.M", "C% = mct/mdd.100%"],
  "target": { "label": "m(Zn)", "unit": "g" },
  "inputMode": "number"
}
```

Submit:

```json
{
  "gameType": "calculation",
  "value": {
    "selectedFormulas": ["n = V / 22,4", "m = n.M"],
    "result": 6.5
  }
}
```

### 7.5. Mô phỏng thí nghiệm

Người chơi chọn hóa chất, dụng cụ, thao tác và quan sát phản ứng.

Tương tác:

- Kéo hóa chất vào ống nghiệm, cốc, bình tam giác.
- Chọn dụng cụ như đèn cồn, kẹp gỗ, giấy quỳ, ống dẫn khí.
- Pha trộn chất theo thứ tự.
- Quan sát kết tủa, đổi màu, thoát khí, tỏa nhiệt.
- Trả lời kết luận hoặc chọn hiện tượng đúng.

Payload:

```json
{
  "labBench": {
    "tools": ["test_tube", "dropper", "litmus_paper"],
    "chemicals": ["HCl", "NaOH", "phenolphthalein"]
  },
  "goal": "Xác định dung dịch bazơ bằng chỉ thị",
  "allowedActions": ["pick", "pour", "drop", "observe"],
  "simulationRules": "server_evaluated"
}
```

Submit:

```json
{
  "gameType": "lab_simulation",
  "value": {
    "actions": [
      { "type": "pick", "item": "phenolphthalein" },
      { "type": "drop", "target": "NaOH" }
    ],
    "conclusion": "NaOH làm phenolphthalein hóa hồng"
  }
}
```

### 7.6. Phân loại chất/phản ứng

Người chơi kéo chất hoặc phản ứng vào nhóm đúng.

Tương tác:

- Kéo thẻ vào cột acid, base, muối, oxide.
- Hoặc kéo phản ứng vào hóa hợp, phân hủy, thế, trao đổi, oxi hóa khử.
- Feedback cục bộ chỉ báo hợp lệ về mặt thao tác, backend chấm đúng sai.

### 7.7. Nhận diện hiện tượng

Người chơi xem mô phỏng phản ứng rồi chọn hoặc nhập kết luận.

Tương tác:

- Quan sát mô phỏng: tạo kết tủa, đổi màu, khí bay lên, nhiệt kế tăng.
- Chọn hiện tượng.
- Ghép hiện tượng với phương trình hoặc sản phẩm.

## 8. Luồng realtime trong trận

Frontend không tự quyết định round hiện tại. Backend là nguồn sự thật.

Client flow:

1. Gọi `GET /api/arena/rooms/:id/state`.
2. Gọi `GET /api/arena/realtime-token`.
3. `supabase.realtime.setAuth(token)`.
4. Subscribe các thay đổi:
   - `arena_rooms`
   - `arena_room_players`
   - `arena_game_instances`
   - `arena_round_results`
5. Khi nhận event, client fetch lại state hoặc merge patch an toàn.

State gửi cho client:

```json
{
  "room": {
    "id": "924681",
    "status": "playing",
    "currentRoundIndex": 2,
    "roundStartedAt": "2026-05-31T10:00:00Z",
    "roundEndsAt": "2026-05-31T10:00:55Z"
  },
  "currentTask": {
    "id": "instance_abc",
    "gameType": "atom_match",
    "prompt": "Ghép nguyên tử đúng cho H2O",
    "payload": {},
    "timeLimitSeconds": 55
  },
  "players": [],
  "scoreboard": [],
  "serverTime": "2026-05-31T10:00:08Z"
}
```

State không bao giờ chứa `answer`.

## 9. Phản hồi sau mỗi thao tác và mỗi lượt

Phản hồi nên có ba cấp:

### 9.1. Phản hồi thao tác tức thì

Được phép chạy ở client nếu không lộ đáp án:

- Slot có nhận được loại thẻ này không.
- Hệ số có vượt giới hạn không.
- Lớp electron có vượt sức chứa cơ bản không.
- Input số có đúng định dạng không.

### 9.2. Phản hồi attempt

Do backend trả về sau mỗi lần submit hoặc kiểm tra:

```json
{
  "accepted": true,
  "isCorrect": false,
  "partialScore": 70,
  "feedback": {
    "type": "partial",
    "message": "Một số nguyên tố đã cân bằng, nhưng O chưa cân bằng."
  },
  "remainingAttempts": 1
}
```

Trong ranked PK, feedback nên hạn chế để không biến thành lộ đáp án. Trong practice, feedback có thể chi tiết hơn.

### 9.3. Phản hồi resolve round

Khi tất cả đã submit hoặc hết giờ:

- Hiện đáp án đúng.
- Hiện mô hình đúng.
- Hiện giải thích ngắn.
- Hiện điểm nhận được.
- Hiện thay đổi combo.
- So sánh tốc độ với đối thủ.

## 10. Hệ thống tính điểm

Điểm một round:

```txt
roundScore =
  basePoints
  * accuracyMultiplier
  * difficultyMultiplier
  * speedMultiplier
  * attemptMultiplier
  + comboBonus
```

Thành phần:

- `basePoints`: điểm nền của task.
- `accuracyMultiplier`: đúng hoàn toàn, đúng một phần hoặc sai.
- `difficultyMultiplier`: easy 1.0, medium 1.2, hard 1.5, expert 2.0.
- `speedMultiplier`: dựa trên phần trăm thời gian còn lại.
- `attemptMultiplier`: giảm điểm nếu thử nhiều lần.
- `comboBonus`: thưởng chuỗi đúng liên tiếp.

Ví dụ:

```json
{
  "basePoints": 150,
  "accuracyMultiplier": 1,
  "difficultyMultiplier": 1.2,
  "speedMultiplier": 1.18,
  "attemptMultiplier": 0.9,
  "comboBonus": 25,
  "finalScore": 216
}
```

Quy tắc khuyến nghị:

| Trường hợp | Điểm |
| --- | ---: |
| Đúng lần đầu, nhanh | 100-150% base |
| Đúng nhưng chậm | 80-110% base |
| Đúng sau nhiều lần thử | 50-90% base |
| Đúng một phần | 20-70% base |
| Sai hoàn toàn | 0 |
| Bỏ lượt | 0 và mất combo |

## 11. Combo, lỗi sai và gợi ý

Combo giúp tăng tính game nhưng không nên làm mất cân bằng:

- `comboStreak`: tăng khi đúng liên tiếp.
- `comboBonus`: giới hạn tối đa 20-25% tổng điểm round.
- Sai hoặc hết giờ sẽ reset combo.
- Practice mode có thể cho hint mà không phạt nặng.
- Ranked mode dùng hint rất hạn chế hoặc không cho hint.

Penalty số lần thử:

```txt
attemptMultiplier = max(0.5, 1 - (attemptCount - 1) * 0.15)
```

Speed bonus:

```txt
speedMultiplier = 1 + min(0.35, remainingTimeRatio * 0.35)
```

## 12. Phân bổ độ khó

Độ khó không nên chỉ dựa trên nhãn `easy`, `medium`, `hard`. Nên tính từ nhiều yếu tố:

- `gradeLevel`: lớp 8, 9, 10, 11, 12.
- `conceptDifficulty`: độ khó kiến thức.
- `interactionDifficulty`: độ phức tạp thao tác.
- `calculationSteps`: số bước tính.
- `estimatedSeconds`: thời gian dự kiến.
- `mistakeRate`: tỉ lệ sai trong dữ liệu thực tế.

Backend có thể tính:

```txt
effectiveDifficulty =
  selectedDifficulty
  + rankAdjustment
  + playerMasteryAdjustment
  + modeAdjustment
```

Với `auto`, hệ thống chọn nhiệm vụ quanh trình độ người chơi:

- 60% nhiệm vụ vừa sức.
- 25% nhiệm vụ dễ hơn để giữ nhịp.
- 15% nhiệm vụ khó hơn để tạo phân hóa.

## 13. Thời gian thi đấu

Nên hỗ trợ hai mô hình:

### 13.1. Theo từng round

Mỗi task có `timeLimitSeconds`. Round chuyển khi:

- tất cả người chơi submit;
- hoặc hết giờ server;
- hoặc chế độ practice cho phép next thủ công.

### 13.2. Theo tổng trận

Trận có `totalTimeSeconds`. Người chơi làm càng nhanh càng được nhiều round hơn hoặc có bonus cuối trận. Mô hình này phù hợp event hoặc boss mode hơn PK chuẩn.

Khuyến nghị MVP dùng theo từng round để dễ đồng bộ realtime.

## 14. Xác định người chiến thắng

Solo:

1. Tổng điểm cao hơn thắng.
2. Nếu hòa, người có nhiều round đúng hơn thắng.
3. Nếu vẫn hòa, tổng thời gian submit thấp hơn thắng.
4. Nếu vẫn hòa, người có ít attempt sai hơn thắng.
5. Nếu vẫn hòa, casual cho hòa, ranked có sudden-death.

Team mode:

```txt
teamScore = sum(memberScore) + teamComboBonus + objectiveBonus
```

Tie-break team:

1. Team score.
2. Tổng số round đúng của team.
3. Số thành viên có đóng góp điểm.
4. Thời gian hoàn thành trung bình.

Vẫn nên lưu MVP cá nhân theo:

```txt
mvpScore = personalScore + assistScore + consistencyBonus
```

## 15. Chống gian lận và bảo mật

Nguyên tắc:

- Client không nhận `answer`.
- Client không tự quyết đúng sai.
- Mọi submit đi qua backend.
- Backend dùng server time, không tin `clientElapsedMs`.
- Realtime chỉ đồng bộ state đã sanitize.
- Mỗi player chỉ được submit một kết quả chính thức cho mỗi round trong ranked.
- Practice có thể cho retry nhiều lần, nhưng không cập nhật rank.

Backend nên lưu:

- `attemptCount`
- `submittedAt`
- `serverElapsedMs`
- `clientElapsedMs`
- `inputPayload`
- `isCorrect`
- `scoreAwarded`
- `suspicionFlags`

Các flag cơ bản:

- submit quá nhanh bất thường;
- payload không khớp schema;
- submit trùng;
- chỉnh state round cũ;
- client time lệch quá lớn.

## 16. Data model đề xuất

### `arena_rooms`

Lưu trạng thái phòng và cấu hình trận.

Các cột chính:

- `id`
- `host_id`
- `mode`
- `ranked`
- `status`
- `match_config`
- `current_round_index`
- `round_started_at`
- `round_ends_at`
- `started_at`
- `finished_at`
- `winner_user_id`

### `arena_room_players`

Lưu người chơi trong phòng.

- `room_id`
- `user_id`
- `team_id`
- `status`
- `score`
- `correct_count`
- `combo_streak`
- `attempt_count`
- `last_seen_at`

### `arena_game_templates`

Ngân hàng mini game.

- `id`
- `game_type`
- `topic`
- `grade_level`
- `difficulty`
- `estimated_seconds`
- `base_points`
- `prompt`
- `payload`
- `answer`
- `rubric`
- `explanation`
- `is_active`

### `arena_game_instances`

Nhiệm vụ cụ thể trong một trận.

- `id`
- `room_id`
- `template_id`
- `round_index`
- `game_type`
- `seed`
- `time_limit_seconds`
- `base_points`
- `status`

### `arena_player_attempts`

Mỗi lần người chơi thao tác kiểm tra hoặc submit.

- `id`
- `room_id`
- `round_index`
- `game_instance_id`
- `user_id`
- `attempt_payload`
- `attempt_type`
- `is_final`
- `created_at`

### `arena_round_results`

Kết quả chấm round.

- `id`
- `room_id`
- `round_index`
- `user_id`
- `is_correct`
- `accuracy_score`
- `speed_score`
- `attempt_penalty`
- `combo_bonus`
- `score_awarded`
- `resolved_at`

## 17. API đề xuất

```txt
POST /api/arena/rooms
POST /api/arena/matchmake
POST /api/arena/rooms/:id/join
POST /api/arena/rooms/:id/start
GET  /api/arena/rooms/:id/state
GET  /api/arena/realtime-token
POST /api/arena/rooms/:id/actions
POST /api/arena/rooms/:id/submit
POST /api/arena/rooms/:id/advance
GET  /api/arena/rooms/:id/results
```

`actions` dùng cho thao tác không phải submit cuối:

```json
{
  "roundIndex": 2,
  "gameInstanceId": "instance_abc",
  "action": {
    "type": "place_atom",
    "slotId": "center",
    "symbol": "O"
  }
}
```

`submit` dùng để chấm chính thức:

```json
{
  "roundIndex": 2,
  "gameInstanceId": "instance_abc",
  "gameType": "atom_match",
  "value": {
    "placements": {
      "center": "O",
      "left": "H",
      "right": "H"
    }
  }
}
```

## 18. Kiến trúc frontend

Nên tách Arena thành các phần:

```txt
src/features/arena/
  ArenaPage.jsx
  hooks/
    useArenaRoom.js
    useArenaRealtime.js
    useArenaTimer.js
  components/
    ArenaLobby.jsx
    ArenaMatchmaking.jsx
    ArenaBattleShell.jsx
    ArenaScoreboard.jsx
    ArenaRoundResolver.jsx
  games/
    GameRenderer.jsx
    balancing/
      BalancingGame.jsx
      atomCounter.js
    atom-match/
      AtomMatchGame.jsx
    electron-match/
      ElectronMatchGame.jsx
    calculation/
      CalculationGame.jsx
    lab-simulation/
      LabSimulationGame.jsx
    classification/
      ClassificationGame.jsx
    phenomenon/
      PhenomenonGame.jsx
```

Game renderer:

```js
const GAME_RENDERERS = {
  balancing: BalancingGame,
  atom_match: AtomMatchGame,
  electron_match: ElectronMatchGame,
  calculation: CalculationGame,
  lab_simulation: LabSimulationGame,
  classification: ClassificationGame,
  phenomenon: PhenomenonGame,
};
```

Mỗi game component nhận cùng interface:

```js
{
  task,
  disabled,
  serverTime,
  onAction,
  onSubmit,
  lastFeedback
}
```

## 19. Lộ trình triển khai

### Giai đoạn 1: MVP PK mini game

Mục tiêu:

- Có room realtime.
- Có chuỗi task linh hoạt.
- Có 4 game type đầu:
  - `balancing`
  - `atom_match`
  - `electron_match`
  - `calculation`
- Backend chấm điểm.
- Client không nhận answer.
- Practice room chơi một mình, không cộng rank.

### Giai đoạn 2: Thực hành thí nghiệm

Thêm:

- `lab_simulation`
- `classification`
- `phenomenon`
- Feedback chi tiết hơn cho practice.
- Replay round ngắn sau mỗi lượt.

### Giai đoạn 3: Cạnh tranh nâng cao

Thêm:

- team scoring thật cho `3vs3`, `5vs5`;
- sudden-death;
- season rank;
- anti-cheat nâng cao;
- adaptive difficulty theo mastery;
- event boss mode.

## 20. Acceptance criteria

Một bản triển khai được xem là đạt thiết kế khi:

- Người chơi vào một phòng PK và nhận chuỗi nhiều mini game khác nhau.
- Số lượng round không bị hard-code trong frontend.
- Backend sinh danh sách game instance cho trận.
- Frontend render theo `gameType`.
- Ít nhất 4 game đầu hoạt động: cân bằng, ghép nguyên tử, ghép electron, tính toán.
- Mỗi game có thao tác trực tiếp, không chỉ chọn đáp án.
- Mỗi submit đi qua backend.
- State trả về client không chứa answer.
- Timer dùng server time.
- Scoreboard realtime cập nhật khi có kết quả.
- Có feedback sau round.
- Có luật xác định thắng thua rõ ràng.
- Practice không cộng rank.
- Ranked cập nhật lịch sử và điểm sau khi trận kết thúc.

## 21. Nguyên tắc mở rộng lâu dài

Mỗi mini game mới chỉ cần bổ sung:

- `game_type`
- schema payload
- renderer frontend
- evaluator backend
- scoring adapter nếu cần
- bộ template seed

Không được thêm mini game bằng cách viết nhánh logic rải rác trong toàn bộ Arena. Tất cả game type phải đi qua cùng một registry ở frontend và backend để giữ hệ thống mở rộng được.
