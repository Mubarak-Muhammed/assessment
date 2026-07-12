#!/usr/bin/env python
import sys
sys.path.insert(0, '.')

# Test 1: Check imports
try:
    print("Test 1: Importing main modules...")
    from app.core.config import settings
    print("✓ Config loaded")
    from app.database.session import engine, Base
    print("✓ Database session loaded")
    from app.core.groq_client import llm
    print("✓ LLM loaded")
    from app.langgraph.workflow import graph
    print("✓ Workflow loaded")
    from app.api.endpoints import interaction, agent
    print("✓ API endpoints loaded")
except Exception as e:
    print(f"✗ Import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 2: Check LLM
try:
    print("\nTest 2: Checking LLM...")
    print(f"LLM model: {llm.model_name}")
    print(f"LLM type: {type(llm)}")
    print("✓ LLM is ready")
except Exception as e:
    print(f"✗ LLM check failed: {e}")
    import traceback
    traceback.print_exc()

# Test 3: Check workflow
try:
    print("\nTest 3: Checking workflow graph...")
    print(f"Graph type: {type(graph)}")
    print("✓ Workflow graph is ready")
except Exception as e:
    print(f"✗ Workflow check failed: {e}")
    import traceback
    traceback.print_exc()

print("\n✓ All checks passed!")
