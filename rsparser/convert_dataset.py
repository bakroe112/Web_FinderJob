from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForMaskedLM
import pandas as pd

ds = load_dataset("ganchengguang/resume_seven_class", split="train")
# tokenizer = AutoTokenizer.from_pretrained("google-bert/bert-base-uncased")
# model = AutoModelForMaskedLM.from_pretrained("google-bert/bert-base-uncased")

# Tách label và nội dung từ cột text (phân tách bởi tab \t)
texts = []
labels = []
for row in ds:
    raw = row["text"]
    if "\t" in raw:
        label, content = raw.split("\t", 1)  # Tách tại tab đầu tiên
        labels.append(label.strip())
        texts.append(content.strip())
    else:
        labels.append("Others")
        texts.append(raw.strip())

# 3. Xem các label duy nhất
unique_labels = sorted(set(labels))
print("Các label:", unique_labels)
print("Số lượng label:", len(unique_labels))

# 4. Tạo DataFrame và lưu thành CSV cho AutoTrain
df = pd.DataFrame({"text": texts, "target": labels})

# Gộp các label có quá ít mẫu (< 5) vào "Others" → rồi đổi "Others" thành "Exp"
# Vì stratify yêu cầu mỗi class >= 2 mẫu
label_counts = df["target"].value_counts()
rare_labels = label_counts[label_counts < 5].index.tolist()
if rare_labels:
    print(f"Gộp các label hiếm ({rare_labels}) vào 'Exp'")
    df.loc[df["target"].isin(rare_labels), "target"] = "Exp"

print(df["target"].value_counts())
print(df.head(10))

# 5. Chia train/valid (90/10)
from sklearn.model_selection import train_test_split
train_df, valid_df = train_test_split(df, test_size=0.1, random_state=42, stratify=df["target"])

# 6. Lưu ra file CSV
train_df.to_csv("data/train.csv", index=False)
valid_df.to_csv("data/valid.csv", index=False)
